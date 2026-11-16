#!/usr/bin/env node
// The README's demo clip, docs/demo.webp: the example deck in Playwright, a
// ~30 s tour of its slides, light first, then dark from the middle (Slidev's
// `d`). 1280×720, 15 fps, full color (an animated WebP: a GIF's 256 colors
// band the gradients). Needs ffmpeg and img2webp (libwebp).
//
//   npm run demo

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
const W = 1280
const H = 720
const FPS = 15

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
  const video = page.video()
  await context.close()
  const webm = await video.path()

  // the tour's last `length` seconds (before it: the page loading), as frames
  const frames = path.join(tmp, 'frames')
  fs.mkdirSync(frames)
  execFileSync('ffmpeg', ['-loglevel', 'error', '-sseof', `-${length.toFixed(2)}`, '-i', webm, '-vf', `fps=${FPS}`, path.join(frames, 'f%04d.png')])
  const pngs = fs.readdirSync(frames).filter(f => f.endsWith('.png')).sort().map(f => path.join(frames, f))
  if (process.env.DEMO_FRAMES) fs.cpSync(frames, process.env.DEMO_FRAMES, { recursive: true }) // to look at the source frames
  // Every frame a key frame: WebP's deltas count faint changes (a fade's tail)
  // as unchanged and leave ghosts of the slide before. A deck stands still
  // most of the time, so a run of frames that barely differ becomes one
  // frame held that long: the file stays small.
  const ms = Math.round(1000 / FPS)
  const runs = [] // [file, duration]
  let prev = null
  for (const f of pngs) {
    const img = PNG.sync.read(fs.readFileSync(f))
    const same = prev && pixelmatch(prev.data, img.data, null, W, H, { threshold: 0.1 }) < 40
    if (same) runs.at(-1)[1] += ms
    else { runs.push([f, ms]); prev = img }
  }
  fs.mkdirSync(path.dirname(out), { recursive: true })
  const args = ['-loop', '0', '-lossy', '-q', '85', '-m', '4', '-kmin', '0', '-kmax', '1']
  for (const [f, d] of runs) args.push('-d', String(d), f)
  execFileSync('img2webp', [...args, '-o', out], { maxBuffer: 1 << 26 })
  console.log(`[demo] ${pngs.length} frames → ${runs.length} distinct`)
  const mb = fs.statSync(out).size / 1e6
  console.log(`[demo] ${path.relative(root, out)}: ${length.toFixed(1)} s, ${pngs.length} frames, ${mb.toFixed(2)} MB`)
}
finally {
  await browser.close()
  server.stop()
  fs.rmSync(tmp, { recursive: true, force: true })
}
