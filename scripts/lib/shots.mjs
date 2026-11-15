// Shared by check-decks.mjs and regress.mjs: start a Slidev dev server, get
// one slide ready for a screenshot, compare two PNGs.

import { spawn } from 'node:child_process'
import { PNG } from 'pngjs'
import pixelmatchModule from 'pixelmatch'

const pixelmatch = pixelmatchModule.default ?? pixelmatchModule
const sleep = ms => new Promise(r => setTimeout(r, ms))

/**
 * `npx slidev <file> --port <port> ...args` in `cwd`, resolved once it serves.
 * Fails fast when the server exits, and with the end of its log either way.
 */
export async function startDevServer({ cwd, file = 'slides.md', port, args = [], timeoutMs = 120000 }) {
  const proc = spawn('npx', ['slidev', file, '--port', String(port), ...args], {
    cwd, stdio: ['ignore', 'pipe', 'pipe'], detached: true,
  })
  let log = ''
  proc.stdout.on('data', (d) => { log += d })
  proc.stderr.on('data', (d) => { log += d })
  const stop = () => { try { process.kill(-proc.pid) } catch {} }
  for (const until = Date.now() + timeoutMs; Date.now() < until;) {
    try { if ((await fetch(`http://localhost:${port}`)).ok) return { port, stop, log: () => log } }
    catch {}
    if (proc.exitCode !== null) break
    await sleep(500)
  }
  stop()
  const why = proc.exitCode !== null ? `exited with ${proc.exitCode}` : 'did not start'
  throw new Error(`Slidev ${why} (${cwd}/${file})\n${log.slice(-1500)}`)
}

/** The deck's slide count, from the first page */
export async function slideCount(page, port) {
  await page.goto(`http://localhost:${port}/1`, { waitUntil: 'load' })
  await page.waitForFunction(() => window.__slidev__?.nav?.total, null, { timeout: 60000 })
  return page.evaluate(() => window.__slidev__.nav.total)
}

// Still pictures: no animation or transition, smooth scroll off; parts that
// change on every run whatever the theme (an embedded live page, a running
// countdown's digits) hidden with their layout kept
const FREEZE = '*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}'
  + ' iframe,.countdown-time{visibility:hidden!important}'

/**
 * Open slide `n` in `scheme` and wait until it is ready to capture: compiled
 * (Slidev shows nothing, then "Loading slide…" for a slide compiled on first
 * visit), with content, images loaded, fonts ready; code blocks with
 * {maxHeight} shown from the top (Slidev scrolls them at a varying moment).
 * `clicks` opens it at that click (Slidev's ?clicks=).
 */
export async function prepareSlide(page, port, n, { scheme, embedded = false, clicks = 0, settleMs = 300, onSlow } = {}) {
  const query = [embedded && 'embedded=true', clicks && `clicks=${clicks}`].filter(Boolean).join('&')
  await page.goto(`http://localhost:${port}/${n}${query ? `?${query}` : ''}`, { waitUntil: 'networkidle' })
    .catch(() => page.waitForLoadState('load'))
  await page.evaluate(s => document.documentElement.classList.toggle('dark', s === 'dark'), scheme)
  await page.addStyleTag({ content: FREEZE })
  await page.waitForFunction((no) => {
    const slide = document.querySelector(`[data-slidev-no="${no}"]`)
    return slide && !slide.querySelector('.slidev-slide-loading')
      && (slide.textContent.trim() || slide.querySelector('img, svg, canvas, video, iframe'))
      && [...document.images].every(i => i.complete)
  }, n, { timeout: 30000 }).catch(() => onSlow?.(n))
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(settleMs)
  await page.evaluate(() => document.querySelectorAll('pre, .slidev-code-wrapper').forEach((e) => { e.scrollTop = 0 }))
  await page.waitForTimeout(100)
}

/**
 * Pixels that differ between two PNG buffers, and the diff image. Different
 * sizes can't be compared pixel by pixel: { px: Infinity, note: 'size' }.
 */
export function diffPng(a, b, { threshold = 0.05 } = {}) {
  const A = PNG.sync.read(a); const B = PNG.sync.read(b)
  if (A.width !== B.width || A.height !== B.height)
    return { px: Infinity, note: 'size', diff: null }
  const D = new PNG({ width: A.width, height: A.height })
  const px = pixelmatch(A.data, B.data, D.data, A.width, A.height, { threshold, diffMask: false, alpha: 0.2 })
  return { px, diff: PNG.sync.write(D) }
}

/** How many clicks the open slide has (after prepareSlide) */
export const clicksTotal = page => page.evaluate(() => window.__slidev__?.nav?.clicksTotal ?? 0)

/**
 * Every state of slide `n` to capture: [key, picture] pairs, the slide as it
 * opens first ("n"), then each click ("n.1", "n.2"…) when `withClicks`.
 * `shoot(clicks)` prepares and captures one state and returns the picture.
 */
export async function slideStates(page, n, withClicks, shoot) {
  const out = [[String(n), await shoot(0)]]
  if (!withClicks) return out
  const total = await clicksTotal(page)
  for (let k = 1; k <= total; k++) out.push([`${n}.${k}`, await shoot(k)])
  return out
}
