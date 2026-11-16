#!/usr/bin/env node
// WCAG AA text contrast, slide by slide, in dark and light (with --high,
// in the high-contrast mode: it must pass too).
//
//   node scripts/check-contrast.mjs [deck.md] [--pages 1-40] [--mode dark|light|both] [--high]
//
// Starts a dev server for the deck (default: example/slides.md), and on each
// slide measures every piece of text against the background it is composited
// on: the colors of the boxes behind it, blended up to the slide's own
// background. Text on a picture or a gradient, and gradient-filled text (the
// titles), can't be read from styles and is skipped, as is text over a box
// filled by its ::before / ::after; a gradient behind text counts as each of
// its colors (the worst wins).
// Text dimmed on purpose (opacity below 0.75: v-click, dim-prior) is left
// out. AA: 4.5:1,
// or 3:1 for large text (24px, or 18.66px bold). Exit code 1 on a failure.

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { prepareSlide, slideCount, startDevServer } from './lib/shots.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def }
const deck = path.resolve(args.find(a => a.endsWith('.md')) ?? path.join(root, 'example/slides.md'))
const modes = { both: ['dark', 'light'], dark: ['dark'], light: ['light'] }[opt('mode', 'both')]
const high = args.includes('--high')
const [from, to] = (opt('pages', '') || '').split('-').map(Number)

const server = await startDevServer({ cwd: path.dirname(deck), file: path.basename(deck), port: 3990 + Math.floor(Math.random() * 9) })
const browser = await chromium.launch()
let failures = 0
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  const total = await slideCount(page, server.port)
  for (const scheme of modes) {
    for (let n = from || 1; n <= (to || total); n++) {
      await prepareSlide(page, server.port, n, { scheme })
      if (high) await page.evaluate(() => document.documentElement.classList.add('high-contrast'))
      const bad = await page.evaluate(measure, { no: n, aa: 4.5, large: 3 })
      for (const b of bad) {
        failures++
        console.log(`${scheme}${high ? ' high' : ''} slide ${n}: ${b.ratio}:1 < ${b.need} "${b.text}" ${b.fg} on ${b.bg}`)
      }
    }
  }
}
finally {
  await browser.close()
  server.stop()
}
console.log(failures ? `[check:contrast] ${failures} failing text runs` : '[check:contrast] ok')
process.exit(failures ? 1 : 0)

// In the page: text runs on slide `no` below the contrast they need
function measure({ no, aa, large }) {
  // rgb() / rgba(), and color(srgb …), which is what color-mix() computes to
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/)
    if (m) {
      const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(Number)
      return { r, g, b, a }
    }
    const s = c.match(/color\(srgb ([^)]+)\)/)
    if (!s) return null
    const [r, g, b, a = 1] = s[1].split(/[\s/]+/).filter(Boolean).map(Number)
    return { r: r * 255, g: g * 255, b: b * 255, a }
  }
  const over = (top, under) => ({ // top blended over an opaque `under`
    r: top.r * top.a + under.r * (1 - top.a),
    g: top.g * top.a + under.g * (1 - top.a),
    b: top.b * top.a + under.b * (1 - top.a),
    a: 1,
  })
  const lum = ({ r, g, b }) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const hex = c => `#${[c.r, c.g, c.b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('')}`

  const slide = document.querySelector(`[data-slidev-no="${no}"]`)
  // a parallax picture shows through the slide: what's behind can't be read
  if (!slide || document.querySelector('.deck-parallax')) return []
  // the slide's own background, the base everything blends onto
  let base = { r: 255, g: 255, b: 255, a: 1 }
  for (let el = slide; el; el = el.parentElement) {
    const c = parse(getComputedStyle(el).backgroundColor)
    if (c && c.a > 0.99) { base = c; break }
  }

  // pictures, and diagrams drawn in SVG (a pyramid's steps): what text over them sits on can't be read
  const pictures = [...slide.querySelectorAll('img, video, canvas, iframe, svg')]
    .filter(p => !p.closest('.slide-chrome')).map(p => p.getBoundingClientRect()).filter(r => r.width > 8 && r.height > 8)
  const bad = []
  const seen = new Set()
  const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    const el = node.parentElement
    if (!el || !node.data.trim() || seen.has(el)) continue
    seen.add(el)
    if (el.closest('svg, canvas, iframe, .katex, .slidev-code-wrapper pre, .print-only, [aria-hidden="true"]')) continue
    const rect = el.getBoundingClientRect()
    if (rect.width < 1 || rect.height < 1) continue
    const cs = getComputedStyle(el)
    if (cs.visibility !== 'visible') continue

    // opacity down the tree; gradient-filled text and pictures behind: skip
    // A gradient behind the text counts as each of its color stops (the worst
    // one decides); a picture can't be read and is skipped
    let opacity = 1
    let skip = false
    const layers = [] // each: a list of colors (one, or a gradient's stops)
    // text over a picture (a caption on a photo): unreadable from styles
    if (pictures.some(p => p.left < rect.right && p.right > rect.left && p.top < rect.bottom && p.bottom > rect.top)) continue
    for (let e = el; e && e !== slide.parentElement; e = e.parentElement) {
      const s = getComputedStyle(e)
      opacity *= Number(s.opacity)
      if (s.backgroundClip === 'text' || s.webkitBackgroundClip === 'text') { skip = true; break }
      // layered backgrounds clipped differently (a gradient border: a fill on
      // the padding box over a gradient on the border box) can't be modeled
      if (s.backgroundImage !== 'none' && s.backgroundClip.includes(',')) { skip = true; break }
      // a ::before / ::after covering the box (a gradient border, a fill
      // drawn under the text): what is behind the text can't be told apart.
      // Small ones (a window's dots, a hover underline) don't matter
      const box = e.getBoundingClientRect()
      for (const pseudo of ['::before', '::after']) {
        const ps = getComputedStyle(e, pseudo)
        if (ps.content === 'none' || ps.content === 'normal') continue
        const painted = (parse(ps.backgroundColor)?.a ?? 0) > 0 || ps.backgroundImage !== 'none'
        if (painted && Number.parseFloat(ps.width) >= box.width * 0.8 && Number.parseFloat(ps.height) >= box.height * 0.8) skip = true
      }
      if (skip) break
      const c = parse(s.backgroundColor)
      if (s.backgroundImage !== 'none') {
        if (/url\(/.test(s.backgroundImage)) { skip = true; break }
        const stops = (s.backgroundImage.match(/rgba?\([^)]+\)|color\(srgb [^)]+\)/g) ?? []).map(parse).filter(Boolean)
        if (stops.length) { layers.push(stops); if (stops.every(t => t.a > 0.99)) break; continue }
      }
      if (c && c.a > 0) layers.push([c])
      if (c && c.a > 0.99) break
    }
    if (skip || opacity < 0.75) continue // dimmed on purpose (v-click, dim-prior, a stack's other layers)
    const fg0 = parse(cs.color)
    if (!fg0 || fg0.a === 0) continue

    // every combination of the layers' colors, blended onto the base
    let bgs = [base]
    for (const layer of layers.reverse()) bgs = bgs.flatMap(under => layer.map(c => over(c, under)))
    let ratio = Infinity
    let bg = base
    let fg = base
    for (const b of bgs) {
      const f = over({ ...fg0, a: fg0.a * opacity }, b)
      const [l1, l2] = [lum(f), lum(b)].sort((x, y) => y - x)
      const r = (l1 + 0.05) / (l2 + 0.05)
      if (r < ratio) { ratio = r; bg = b; fg = f }
    }
    const size = Number.parseFloat(cs.fontSize)
    const bold = Number(cs.fontWeight) >= 700
    const need = size >= 24 || (bold && size >= 18.66) ? large : aa
    if (ratio + 0.005 < need)
      bad.push({ ratio: ratio.toFixed(2), need, text: node.data.trim().slice(0, 40), fg: hex(fg), bg: hex(bg) })
  }
  return bad
}
