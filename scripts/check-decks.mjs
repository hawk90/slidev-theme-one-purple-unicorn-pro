#!/usr/bin/env node
// Check real decks against this repo's theme before a release.
//
// For each deck file it starts two Slidev dev servers in the deck's own
// project (its node_modules, its Slidev version): one with the theme the deck
// already uses, one with `--theme <this repo>`. It screenshots every slide in
// both and reports the slides that changed, with diff images.
//
//   npm run check:decks -- ../career_slide/slides.md ../CUDA/content/x.md
//   options: --pages 1-20   --mode dark|light|both (default dark)
//            --current <theme>  theme for the baseline when the deck sets it on
//                               the command line instead of in its headmatter
//            --out <dir> (default ./deck-check)   --threshold <pixels> (default 200)
//
// Nothing in the deck projects is modified.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { diffPng, prepareSlide, slideCount, startDevServer } from './lib/shots.mjs'

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
const currentTheme = opt('current', '')
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
    await prepareSlide(page, port, n, { scheme, settleMs: 700, onSlow: no => console.warn(`  slide ${no}: still loading after 30 s`) })
    shots[n] = await page.screenshot()
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
  let current, local
  try {
    current = await startServer(deck, currentTheme ? ['--theme', currentTheme] : [])
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
      console.log(`  ${scheme}: ${Object.keys(a).length} slides, ${changed.length} changed${changed.length ? ': ' + changed.join(', ') : ''}`)
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
