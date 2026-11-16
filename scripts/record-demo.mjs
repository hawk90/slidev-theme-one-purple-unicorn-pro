#!/usr/bin/env node
// The README's demo clip, docs/demo.webp: a ~30 s tour of the example deck,
// light first, then dark from the middle (Slidev's `d`). 1920×1080, full
// color. Needs ffmpeg and img2webp (libwebp).
//
//   npm run demo
//
// Not a screen recording (its video codec blurs the text): lossless
// screenshots at 2× (2560×1440), a burst of them after each slide change or
// click (the transition, entrances), then one still held for the rest of the
// step. Scaled to 1920×1080; every frame a key frame (WebP's deltas leave
// ghosts of the frame before), near-identical neighbours merged into one.

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import pixelmatchModule from 'pixelmatch'
import { PNG } from 'pngjs'
import { startDevServer } from './lib/shots.mjs'

const pixelmatch = pixelmatchModule.default ?? pixelmatchModule
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'docs/demo.webp')
const W = 1280 // the page; captured at 2×
const H = 720
const OUT_W = 1920
const OUT_H = 1080
const BURST_MS = 900 // after a change: frames as fast as they come

// [slide title, ms on it, clicks to step through while there]
const TOUR = [
  ['One Purple Unicorn Pro', 2200, 0],
  ['Typography Showcase', 1800, 0],
  ['CUDA / C++ Code', 2000, 0],
  ['Click Tabs', 2400, 2],
  ['Infographics: Flow and Pyramid', 2000, 0],
  ['Meter and Ghost', 1800, 0],
  // dark from here on
  ['Charts', 2000, 0],
  ['Charts: Radar and ECharts', 2000, 0],
  ['Agent Transcript', 3200, 3],
  ['Image Walkthrough', 3000, 2],
  ['IDE Chrome', 2000, 0],
  ['Story: Before / After and Benchmark', 2000, 0],
  ['Thank You!', 2000, 0],
]
const DARK_AT = 6

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'opu-demo-'))
const server = await startDevServer({ cwd: path.join(root, 'example'), port: 3970 })
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2, colorScheme: 'light' })
  await page.addInitScript(() => localStorage.setItem('slidev-color-schema', 'light'))
  await page.goto(`http://localhost:${server.port}/1`)
  await page.waitForFunction(() => window.__slidev__?.nav, null, { timeout: 90000 })
  const nos = await page.evaluate(titles => titles.map(t => window.__slidev__.nav.slides.find(s => s.meta.slide.title === t)?.no), TOUR.map(t => t[0]))
  const missing = TOUR.filter((_, i) => !nos[i]).map(t => t[0])
  if (missing.length) throw new Error(`no slide titled: ${missing.join(', ')}`)
  // warm-up: compile every slide on the tour once (no "Loading slide…" in the clip)
  for (const no of nos) { await page.evaluate(n => window.__slidev__.nav.go(n), no); await page.waitForTimeout(1200) }
  await page.evaluate(() => window.__slidev__.nav.go(1))
  await page.evaluate(() => document.fonts.ready)
  await page.mouse.move(W / 2, H / 2) // no nav bar: the pointer stays still
  await page.waitForTimeout(1500)

  // frames: [file, ms shown]
  const frames = []
  let n = 0
  const shoot = async () => {
    const file = path.join(tmp, `f${String(n++).padStart(4, '0')}.png`)
    await page.screenshot({ path: file })
    return file
  }
  // a change (slide or click), then `ms` in all: a burst, then a held still
  async function step(change, ms) {
    await change()
    const t0 = Date.now()
    let last = null
    let lastAt = t0
    while (Date.now() - t0 < Math.min(BURST_MS, ms - 300)) {
      const file = await shoot()
      const now = Date.now()
      if (last) frames.push([last, now - lastAt])
      last = file
      lastAt = now
    }
    const rest = Math.max(0, ms - (Date.now() - t0))
    await page.waitForTimeout(Math.min(rest, 400)) // settle
    const still = await shoot()
    if (last) frames.push([last, Date.now() - lastAt])
    frames.push([still, Math.max(rest - 400, 100)])
  }

  for (let i = 0; i < TOUR.length; i++) {
    const [, ms, clicks] = TOUR[i]
    const share = clicks ? ms / (clicks + 1) : ms
    await step(async () => {
      if (i === DARK_AT) await page.keyboard.press('d')
      await page.evaluate(no => window.__slidev__.nav.go(no), nos[i])
    }, share)
    for (let c = 0; c < clicks; c++) await step(() => page.keyboard.press('ArrowRight'), share)
  }

  // near-identical neighbours: one frame, held as long as both
  const runs = []
  let prev = null
  for (const [file, ms] of frames) {
    const img = PNG.sync.read(fs.readFileSync(file))
    if (prev && pixelmatch(prev.data, img.data, null, img.width, img.height, { threshold: 0.05 }) < 30) runs.at(-1)[1] += ms
    else { runs.push([file, ms]); prev = img }
  }

  // 2560×1440 → 1920×1080, then one animated WebP
  const scaled = path.join(tmp, 'scaled')
  fs.mkdirSync(scaled)
  const list = runs.map(([f], i) => { const s = path.join(scaled, `s${String(i).padStart(4, '0')}.png`); execFileSync('ffmpeg', ['-loglevel', 'error', '-i', f, '-vf', `scale=${OUT_W}:${OUT_H}:flags=lanczos`, s]); return s })
  fs.mkdirSync(path.dirname(out), { recursive: true })
  const args = ['-loop', '0', '-lossy', '-q', '88', '-m', '4', '-kmin', '0', '-kmax', '1']
  runs.forEach(([, ms], i) => args.push('-d', String(Math.round(ms)), list[i]))
  execFileSync('img2webp', [...args, '-o', out], { maxBuffer: 1 << 26 })
  const total = runs.reduce((a, [, ms]) => a + ms, 0) / 1000
  console.log(`[demo] ${path.relative(root, out)}: ${OUT_W}×${OUT_H}, ${total.toFixed(1)} s, ${frames.length} shots → ${runs.length} frames, ${(fs.statSync(out).size / 1e6).toFixed(2)} MB`)
}
finally {
  await browser.close()
  server.stop()
  fs.rmSync(tmp, { recursive: true, force: true })
}
