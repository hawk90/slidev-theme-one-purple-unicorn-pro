#!/usr/bin/env node
// The README's demo clip, docs/demo.gif: the example deck in Playwright, a
// tour of a few slides, light first, then dark from the middle (Slidev's `d`).
// 1280×720, ~13 s, under 5 MB. Needs ffmpeg.
//
//   node scripts/record-demo.mjs

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { startDevServer } from './lib/shots.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'docs/demo.gif')
const W = 1280
const H = 720

// [slide title, ms on it, clicks to step through while there]
const TOUR = [
  ['One Purple Unicorn Pro', 1600, 0],
  ['Typography Showcase', 1300, 0],
  ['CUDA / C++ Code', 1400, 0],
  ['Infographics: Flow and Pyramid', 1300, 0],
  // dark from here on
  ['Charts', 1600, 0],
  ['Agent Transcript', 2200, 3],
  ['Timeline: Entrance and Click Steps', 1800, 2],
  ['Story: Before / After and Benchmark', 1500, 0],
]
const DARK_AT = 4

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'opu-demo-'))
const server = await startDevServer({ cwd: path.join(root, 'example'), port: 3970 + Math.floor(Math.random() * 20) })
const browser = await chromium.launch()
let video
try {
  // warm-up: compile every slide on the tour once, so the clip has no "Loading slide…"
  const warm = await browser.newPage({ viewport: { width: W, height: H } })
  await warm.goto(`http://localhost:${server.port}/1`)
  await warm.waitForFunction(() => window.__slidev__?.nav, null, { timeout: 90000 })
  const nos = await warm.evaluate(titles => titles.map(t => window.__slidev__.nav.slides.find(s => s.meta.slide.title === t)?.no), TOUR.map(t => t[0]))
  const missing = TOUR.filter((_, i) => !nos[i]).map(t => t[0])
  if (missing.length) throw new Error(`no slide titled: ${missing.join(', ')}`)
  for (const no of nos) { await warm.evaluate(n => window.__slidev__.nav.go(n), no); await warm.waitForTimeout(1500) }
  await warm.close()

  const context = await browser.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: tmp, size: { width: W, height: H } }, colorScheme: 'light' })
  await context.addInitScript(() => localStorage.setItem('slidev-color-schema', 'light'))
  const page = await context.newPage()
  await page.goto(`http://localhost:${server.port}/1`)
  await page.waitForFunction(() => window.__slidev__?.nav, null, { timeout: 90000 })
  await page.evaluate(() => document.fonts.ready)
  await page.mouse.move(W / 2, H / 2) // no nav bar: the pointer stays still
  const start = Date.now()
  for (let i = 0; i < TOUR.length; i++) {
    const [, ms, clicks] = TOUR[i]
    if (i === DARK_AT) await page.keyboard.press('d')
    await page.evaluate(n => window.__slidev__.nav.go(n), nos[i])
    const step = clicks ? ms / (clicks + 1) : ms
    await page.waitForTimeout(step)
    for (let c = 0; c < clicks; c++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(step) }
  }
  const length = (Date.now() - start) / 1000
  video = page.video()
  await context.close()
  const webm = await video.path()

  // keep the tour's last `length` seconds (before it: the page loading); one palette for the clip
  const filters = `fps=8,scale=${W}:${H}:flags=lanczos,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`
  fs.mkdirSync(path.dirname(out), { recursive: true })
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-sseof', `-${length.toFixed(2)}`, '-i', webm, '-vf', filters, '-loop', '0', out])
  const mb = fs.statSync(out).size / 1e6
  console.log(`[demo] ${path.relative(root, out)}: ${length.toFixed(1)} s, ${mb.toFixed(2)} MB`)
  if (mb > 5) console.warn('[demo] over 5 MB: shorten the tour or lower fps / colors')
}
finally {
  await browser.close()
  server.stop()
  fs.rmSync(tmp, { recursive: true, force: true })
}
