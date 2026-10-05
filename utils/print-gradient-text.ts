// Gradient text in PDF export.
//
// Gradient text is CSS `background-clip: text`. Chromium writes it into a PDF
// as text used as a clip, and PDF viewers disagree on that: macOS Preview /
// PDFKit paint the whole gradient box or black text, poppler (and viewers
// built on it) adds hairline box edges. SVG text with a gradient fill fails
// the same way in other viewers. An image is drawn the same everywhere, so in
// print mode (`slidev export`, the browser export page) each gradient-text
// element gets a high-resolution canvas with its text painted in its gradient,
// laid over the original. The original stays in place, invisible, so layout
// is unchanged and the PDF text can still be searched and copied. The
// presentation itself is untouched.

import { isPrintMode } from './print-mode'

const DONE = 'data-print-gradient'
const PSEUDO = 'data-print-pseudo'
const RESOLUTION = 4 // canvas pixels per CSS pixel

const isTransparent = (color: string) =>
  color === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(color)

const isGradientStyle = (s: CSSStyleDeclaration) =>
  s.backgroundClip === 'text' && s.backgroundImage.startsWith('linear-gradient')
  && isTransparent(s.webkitTextFillColor)

// A gradient ::before / ::after (e.g. the quote layout's closing mark) can't be
// measured or covered, so it is replaced by a real span with the same computed
// style and text, which is then redrawn like any other element
function materializePseudo(el: Element, which: '::before' | '::after') {
  const ps = getComputedStyle(el, which)
  const m = ps.content.match(/^"(.*)"$/s)
  if (!m || !isGradientStyle(ps)) return
  const span = document.createElement('span')
  for (const prop of ps) {
    if (prop !== 'content') span.style.setProperty(prop, ps.getPropertyValue(prop))
  }
  span.textContent = m[1].replace(/\\(.)/g, '$1')
  span.setAttribute('aria-hidden', 'true')
  span.setAttribute(PSEUDO, '')
  if (which === '::before') el.prepend(span)
  else el.append(span)
  el.classList.add(which === '::before' ? 'print-no-before' : 'print-no-after')
}

// Split the arguments of linear-gradient(...) at top-level commas
function gradientArgs(image: string) {
  const inner = image.slice(image.indexOf('(') + 1, image.lastIndexOf(')'))
  const out: string[] = []
  let depth = 0
  let cur = ''
  for (const ch of inner) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = '' }
    else cur += ch
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}

const SIDES: Record<string, number> = {
  'to top': 0, 'to right': 90, 'to bottom': 180, 'to left': 270,
  'to top right': 45, 'to right top': 45, 'to bottom right': 135, 'to right bottom': 135,
  'to bottom left': 225, 'to left bottom': 225, 'to top left': 315, 'to left top': 315,
}

// A canvas gradient matching CSS linear-gradient(...) over a w×h box at (x, 0)
// (CSS gradient-line geometry: the line passes through the box center and its
// length makes the corners hit 0% and 100%)
function canvasGradient(ctx: CanvasRenderingContext2D, image: string, x: number, w: number, h: number) {
  const args = gradientArgs(image)
  let angle = 180
  if (/^-?[\d.]+(deg|turn|rad)$/.test(args[0])) {
    const v = Number.parseFloat(args[0])
    angle = args[0].endsWith('turn') ? v * 360 : args[0].endsWith('rad') ? v * 180 / Math.PI : v
    args.shift()
  }
  else if (args[0] in SIDES) {
    angle = SIDES[args.shift()!]
  }

  const rad = angle * Math.PI / 180
  const dx = Math.sin(rad)
  const dy = -Math.cos(rad)
  const len = Math.abs(w * dx) + Math.abs(h * dy)
  const cx = x + w / 2
  const cy = h / 2
  const g = ctx.createLinearGradient(cx - dx * len / 2, cy - dy * len / 2, cx + dx * len / 2, cy + dy * len / 2)

  // Color stops: "color [pos]"; missing positions are spread evenly
  const stops = args.map((a) => {
    const m = a.match(/^(.*?)(?:\s+(-?[\d.]+)(%|px))?$/)!
    const pos = m[2] === undefined ? null : m[3] === '%' ? Number(m[2]) / 100 : Number(m[2]) / len
    return { color: m[1], pos }
  })
  if (stops[0].pos === null) stops[0].pos = 0
  if (stops.at(-1)!.pos === null) stops.at(-1)!.pos = 1
  for (let i = 1; i < stops.length; i++) {
    if (stops[i].pos !== null) continue
    let j = i
    while (stops[j].pos === null) j++
    const a = stops[i - 1].pos!
    const b = stops[j].pos!
    for (let k = i; k < j; k++) stops[k].pos = a + (b - a) * (k - i + 1) / (j - i + 1)
  }
  for (const s of stops) g.addColorStop(Math.min(1, Math.max(0, s.pos!)), s.color)
  return g
}

interface Run { text: string, parent: Element, left: number, top: number, right: number }

let range: Range // created on first use (the module also loads outside the browser)
function charRect(node: Text, i: number) {
  range.setStart(node, i)
  range.setEnd(node, i + 1)
  const r = range.getClientRects()[0]
  return r && r.width > 0 ? r : null
}

// Text of `el` painted by its gradient, one run per line. A text node on one
// line (the usual title) is measured as a whole; only a node that wraps is
// measured character by character to find its line breaks.
function textRuns(el: Element) {
  const runs: Run[] = []
  range ??= document.createRange()
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    const parent = node.parentElement
    if (!parent) continue
    const ps = getComputedStyle(parent)
    if (!isTransparent(ps.webkitTextFillColor)) continue

    range.selectNodeContents(node)
    const lines = [...range.getClientRects()].filter(r => r.width > 0)
    if (lines.length === 0) continue

    if (lines.length === 1) {
      // Collapse white space as the browser did; keep an edge space only if
      // it was rendered (it is when the text continues after inline content)
      let text = node.data
      if (!ps.whiteSpace.startsWith('pre') && ps.whiteSpace !== 'break-spaces') {
        const end = node.data.trimEnd().length
        text = text.replace(/[\t\n\f\r ]+/g, ' ')
        if (text.startsWith(' ') && !charRect(node, 0)) text = text.slice(1)
        if (text.endsWith(' ') && (end === 0 || !charRect(node, end))) text = text.slice(0, -1)
      }
      const r = lines[0]
      runs.push({ text, parent, left: r.left, top: r.top, right: r.right })
      continue
    }

    let run: Run | null = null
    for (let i = 0; i < node.data.length; i++) {
      const r = charRect(node, i)
      if (!r) continue // collapsed white space
      if (!run || Math.abs(r.top - run.top) > 1) {
        run = { text: '', parent, left: r.left, top: r.top, right: r.right }
        runs.push(run)
      }
      run.text += node.data[i]
      run.right = r.right
    }
  }
  return runs
}

// One scratch canvas for the gradient fill, reused by every element
let paint: HTMLCanvasElement | null = null

function redraw(el: HTMLElement, s: CSSStyleDeclaration) {
  el.setAttribute(DONE, '')

  const box = el.getBoundingClientRect()
  const zoom = el.offsetWidth ? box.width / el.offsetWidth : 1 // slide scaling
  const left = box.left + el.clientLeft * zoom
  const top = box.top + el.clientTop * zoom
  const w = el.clientWidth
  const h = el.clientHeight
  if (!w || !h) return

  const canvas = document.createElement('canvas')
  canvas.className = 'print-gradient-text'
  canvas.setAttribute('aria-hidden', 'true')
  canvas.width = Math.ceil(w * RESOLUTION)
  canvas.height = Math.ceil(h * RESOLUTION)
  Object.assign(canvas.style, {
    position: 'absolute', left: '0', top: '0', width: `${w}px`, height: `${h}px`,
    pointerEvents: 'none',
  })
  const ctx = canvas.getContext('2d')!
  ctx.scale(RESOLUTION, RESOLUTION)

  // 1. The text, in any solid color, at the positions the browser laid it out
  for (const run of textRuns(el)) {
    const ps = getComputedStyle(run.parent)
    ctx.font = `${ps.fontStyle} ${ps.fontWeight} ${ps.fontSize} ${ps.fontFamily}`
    ctx.letterSpacing = ps.letterSpacing === 'normal' ? '0px' : ps.letterSpacing
    const m = ctx.measureText(run.text)
    ctx.save()
    ctx.translate((run.left - left) / zoom, (run.top - top) / zoom + m.fontBoundingBoxAscent)
    if (m.width > 0) ctx.scale((run.right - run.left) / zoom / m.width, 1) // match the laid-out width
    ctx.fillText(run.text, 0, 0)
    ctx.restore()
  }

  // 2. The gradient (tiled like the background), kept only where the text is.
  // Painted on the scratch canvas first: with 'source-in' every fill would
  // clear what the previous tile left.
  paint ??= document.createElement('canvas')
  paint.width = canvas.width // also clears it
  paint.height = canvas.height
  const pctx = paint.getContext('2d')!
  pctx.scale(RESOLUTION, RESOLUTION)
  const size = s.backgroundSize.split(' ')[0]
  const tile = size.endsWith('px') ? Number.parseFloat(size) : w
  const posX = s.backgroundPositionX
  const pos = posX.endsWith('%') ? (w - tile) * Number.parseFloat(posX) / 100 : Number.parseFloat(posX) || 0
  const offset = pos % tile
  for (let x = offset > 0 ? offset - tile : offset; x < w; x += tile) {
    pctx.fillStyle = canvasGradient(pctx, s.backgroundImage, x, tile, h)
    pctx.fillRect(x, 0, tile, h)
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.globalCompositeOperation = 'source-in'
  ctx.drawImage(paint, 0, 0)

  if (s.position === 'static') el.style.position = 'relative'
  // Keep the original for layout and text selection; hide its paint
  el.style.setProperty('background', 'none', 'important')
  el.style.setProperty('-webkit-text-fill-color', 'transparent', 'important')
  el.appendChild(canvas)
}

// Slide elements in `root` (the root itself included)
function slideElements(root: Element | Document) {
  const all = root instanceof Element ? [root, ...root.querySelectorAll('*')] : [...root.querySelectorAll('*')]
  return all.filter(el => el.closest('.slidev-layout') && !el.closest(`[${DONE}]`)) as HTMLElement[]
}

function scan(root: Element | Document) {
  for (const el of slideElements(root)) {
    if (el.hasAttribute(PSEUDO)) continue
    if (!el.classList.contains('print-no-before')) materializePseudo(el, '::before')
    if (!el.classList.contains('print-no-after')) materializePseudo(el, '::after')
  }
  // Document order: an outer gradient element is redrawn (with its children's
  // text) before its children come up, so they are skipped
  for (const el of slideElements(root)) {
    if (el.closest(`[${DONE}]`)) continue
    const s = getComputedStyle(el)
    if (isGradientStyle(s)) redraw(el, s)
  }
}

// Nodes this file adds; they never need a scan of their own
const ownNode = (n: Element) => n.classList.contains('print-gradient-text') || n.hasAttribute(PSEUDO)

export function setupPrintGradientText() {
  if (!isPrintMode()) return

  const style = document.createElement('style')
  style.textContent = '.print-no-before::before, .print-no-after::after { content: none !important; }'
  document.head.appendChild(style)

  // `slidev export` waits for .slidev-slide-loading to be removed before it
  // captures, so hold the capture until the slides have settled and been redrawn
  const hold = document.createElement('div')
  hold.className = 'slidev-slide-loading'
  hold.style.display = 'none'
  document.body.appendChild(hold)

  // First a full scan once the slides have settled, then only what is added
  // later (e.g. another range on the browser export page)
  let pending: Set<Element> | null = null
  let timer: number | undefined
  const schedule = () => {
    clearTimeout(timer)
    timer = window.setTimeout(async () => {
      await document.fonts.ready
      if (pending === null) {
        scan(document)
        pending = new Set()
        hold.remove()
        return
      }
      const roots = [...pending].filter(r => r.isConnected)
      pending.clear()
      for (const r of roots) {
        if (!roots.some(o => o !== r && o.contains(r))) scan(r)
      }
    }, 300)
  }
  new MutationObserver((mutations) => {
    let added = false
    for (const m of mutations) {
      m.addedNodes.forEach((n) => {
        if (!(n instanceof Element) || ownNode(n)) return
        pending?.add(n)
        added = true
      })
    }
    if (added) schedule()
  }).observe(document.body, { childList: true, subtree: true })
  schedule()
}
