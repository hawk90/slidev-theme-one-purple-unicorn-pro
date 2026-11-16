#!/usr/bin/env node
// Check real decks against this repo's theme before a release.
//
// For each deck file it starts two Slidev dev servers in the deck's own
// project (its node_modules, its Slidev version): the baseline, and this
// checkout (`--theme <this repo>`). It screenshots every slide in both and
// reports the slides that changed, with diff images.
//
// The baseline (--baseline) is by default `main`: this repo's main checkout,
// so a branch shows only its own changes. Run from main itself, or with
// `--baseline installed`, it is the theme the deck has installed (an older
// release: everything since shows). A path is a theme folder. Each side's
// theme and version are printed.
//
//   npm run check:decks -- ../career_slide/slides.md ../CUDA/content/x.md
//   options: --pages 1-20   --mode dark|light|both (default dark)
//            --baseline main|installed|<theme folder>   (--current <theme>: the same as a folder)
//            --out <dir> (default ./deck-check)   --threshold <pixels> (default 200)
//            --clicks: every click state too (slide 4 at click 2 is "4.2")
//
// Nothing in the deck projects is modified.

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { diffPng, prepareSlide, slideCount, slideStates, startDevServer } from './lib/shots.mjs'

const themeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const args = process.argv.slice(2)
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  if (i === -1) return fallback
  const [value] = args.splice(i, 2).slice(1)
  return value
}
const pages = opt('pages', '')
const mode = opt('mode', 'dark')
const outDir = path.resolve(opt('out', 'deck-check'))
const threshold = Number(opt('threshold', '200'))
const baselineArg = opt('baseline', '') || opt('current', '') || 'main'

// this repo's main checkout (a worktree's main lives elsewhere)
function mainCheckout() {
  try {
    const list = execFileSync('git', ['worktree', 'list', '--porcelain'], { cwd: themeRoot, encoding: 'utf8' })
    for (const block of list.split('\n\n')) {
      const dir = /^worktree (.+)$/m.exec(block)?.[1]
      if (dir && /^branch refs\/heads\/main$/m.test(block)) return dir
    }
  }
  catch {}
  return ''
}
const version = dir => { try { return JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).version } catch { return '?' } }
let baselineTheme = '' // '' = the deck's installed theme
let baselineLabel = 'installed'
if (baselineArg === 'main') {
  const main = mainCheckout()
  if (main && path.resolve(main) !== themeRoot) { baselineTheme = main; baselineLabel = `main ${version(main)} (${main})` }
  else console.log('[check:decks] this is the main checkout: comparing with each deck\'s installed theme')
}
else if (baselineArg !== 'installed') {
  baselineTheme = path.resolve(baselineArg)
  baselineLabel = `${version(baselineTheme)} (${baselineTheme})`
}
console.log(`[check:decks] local ${version(themeRoot)} (${themeRoot})`)
const withClicks = args.includes('--clicks')
if (withClicks) args.splice(args.indexOf('--clicks'), 1)
const decks = args.filter(a => a.endsWith('.md'))
if (!decks.length) {
  console.error('usage: check-decks <deck.md> [...] [--pages 1-20] [--mode dark|light|both]')
  process.exit(1)
}

let nextPort = 3600

const startServer = (deck, extra) =>
  startDevServer({ cwd: path.dirname(deck), file: path.basename(deck), port: nextPort++, args: extra })

async function capture(browser, port, scheme, range) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, colorScheme: scheme, reducedMotion: 'reduce' })
  const total = await slideCount(page, port)
  const [from, to] = range ? range.split('-').map(Number) : [1, total]
  const shots = {}
  for (let n = from; n <= Math.min(to || from, total); n++) {
    const states = await slideStates(page, n, withClicks, async (clicks) => {
      await prepareSlide(page, port, n, { scheme, clicks, settleMs: 700, onSlow: no => console.warn(`  slide ${no}: still loading after 30 s`) })
      return page.screenshot()
    })
    for (const [key, png] of states) shots[key] = png
  }
  await page.close()
  return shots
}

const browser = await chromium.launch()
const schemes = mode === 'both' ? ['dark', 'light'] : [mode]
let changedTotal = 0

for (const deckArg of decks) {
  const deck = path.resolve(deckArg)
  const name = path.basename(path.dirname(deck)) + '-' + path.basename(deck, '.md')
  console.log(`\n== ${deckArg}`)
  // the installed theme: the one the deck names, in its node_modules
  if (!baselineTheme) {
    const named = /^theme:\s*['"]?([^'"\s]+)/m.exec(fs.readFileSync(deck, 'utf8'))?.[1] ?? ''
    const dir = named && !named.startsWith('.') && !named.startsWith('/') ? path.join(path.dirname(deck), 'node_modules', named) : ''
    console.log(`  baseline: installed ${named || '(no theme)'} ${dir ? version(dir) : ''}`)
  }
  else console.log(`  baseline: ${baselineLabel}`)
  let current, local
  try {
    current = await startServer(deck, baselineTheme ? ['--theme', baselineTheme] : [])
    local = await startServer(deck, ['--theme', themeRoot])
    for (const scheme of schemes) {
      const a = await capture(browser, current.port, scheme, pages)
      const b = await capture(browser, local.port, scheme, pages)
      const changed = []
      for (const n of Object.keys(a)) {
        if (!b[n]) continue
        const { px, diff, note } = diffPng(a[n], b[n])
        if (px > threshold) {
          changed.push(`${n} (${note ?? `${px}px`})`)
          const dir = path.join(outDir, name, scheme)
          fs.mkdirSync(dir, { recursive: true })
          fs.writeFileSync(path.join(dir, `${n}-current.png`), a[n])
          fs.writeFileSync(path.join(dir, `${n}-local.png`), b[n])
          if (diff) fs.writeFileSync(path.join(dir, `${n}-diff.png`), diff)
        }
      }
      changedTotal += changed.length
      console.log(`  ${scheme}: ${Object.keys(a).length} ${withClicks ? 'states' : 'slides'}, ${changed.length} changed${changed.length ? ': ' + changed.join(', ') : ''}`)
    }
  }
  catch (e) {
    console.log(`  ERROR ${e.message.split('\n')[0]}`)
    changedTotal++
  }
  finally {
    current?.stop(); local?.stop()
  }
}

await browser.close()
if (changedTotal) console.log(`\nDiff images: ${outDir}`)
process.exit(changedTotal ? 1 : 0)
