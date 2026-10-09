// Gradient text (CSS `background-clip: text`) in PDF export.
//
// Chromium writes it into a PDF as text used as a clip, and PDF viewers
// disagree on that: macOS Preview / PDFKit paint the whole gradient box or
// black text, poppler adds hairline box edges; SVG gradient text fails in
// other viewers. Each gradient-text element instead gets a canvas with its text
// painted in its gradient, laid over the original, which stays in place
// (invisible) for layout and text search.
//
// An editable PPTX export (`--format pptx-editable`) instead turns the canvas
// into a picture and the original into a text box, painted with its `color`:
// the title came out twice, the copy in black. PowerPoint text has no
// gradients, so there the text goes back to a solid color (solidifyGradientText).

import { colorStops, fillRun, functionArgs, isTransparent, overlayCanvas, paddingBox, textRuns } from './print-canvas'

export const GRADIENT_DONE = 'data-print-gradient'
export const PSEUDO = 'data-print-pseudo'

export const isGradientText = (s: CSSStyleDeclaration) =>
  s.backgroundClip === 'text' && s.backgroundImage.startsWith('linear-gradient')
  && isTransparent(s.webkitTextFillColor)

// A gradient ::before / ::after (e.g. the quote layout's closing mark) can't be
// measured or covered, so it is replaced by a real span with the same computed
// style and text, which is then redrawn like any other element
export function materializePseudo(el: Element, which: '::before' | '::after', ps: CSSStyleDeclaration) {
  const m = ps.content.match(/^"(.*)"$/s)
  if (!m || !isGradientText(ps)) return
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

const SIDES: Record<string, number> = {
  'to top': 0, 'to right': 90, 'to bottom': 180, 'to left': 270,
  'to top right': 45, 'to right top': 45, 'to bottom right': 135, 'to right bottom': 135,
  'to bottom left': 225, 'to left bottom': 225, 'to top left': 315, 'to left top': 315,
}

// A canvas gradient matching CSS linear-gradient(...) over a w×h box at (x, 0)
// (CSS gradient-line geometry: the line passes through the box center and its
// length makes the corners hit 0% and 100%)
function linearGradient(ctx: CanvasRenderingContext2D, image: string, x: number, w: number, h: number) {
  const args = functionArgs(image)
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
  for (const [offset, color] of colorStops(args, len)) g.addColorStop(offset, color)
  return g
}

// One scratch canvas for the gradient fill, reused by every element
let paint: HTMLCanvasElement | null = null

// Room around the text boxes for glyph overhang (italics, swashes)
const OVERHANG = 6

export function redrawGradientText(el: HTMLElement, s: CSSStyleDeclaration) {
  // The gradient is kept for solidifyGradientText: the element's own is cleared below
  el.setAttribute(GRADIENT_DONE, s.backgroundImage)
  const box = paddingBox(el)
  const { width: w, height: h, zoom } = box
  const runs = textRuns(el, ps => isTransparent(ps.webkitTextFillColor))
  if (!w || !h || !runs.length) return

  // The canvas covers only the text (in the element's coordinates); the
  // gradient is still laid out over the whole element
  const x = Math.max(-OVERHANG, Math.min(...runs.map(r => (r.left - box.left) / zoom)) - OVERHANG)
  const y = Math.max(-OVERHANG, Math.min(...runs.map(r => (r.top - box.top) / zoom)) - OVERHANG)
  const cw = Math.max(...runs.map(r => (r.right - box.left) / zoom)) + OVERHANG - x
  const ch = Math.max(...runs.map(r => (r.bottom - box.top) / zoom)) + OVERHANG - y
  const made = overlayCanvas('print-gradient-text', cw, ch, x, y)
  if (!made) return
  const { canvas, ctx, res } = made
  ctx.translate(-x, -y)

  // 1. The text, in any solid color, at the positions the browser laid it out
  for (const run of runs) fillRun(ctx, run, box.left, box.top, zoom)

  // 2. The gradient (tiled like the background), kept only where the text is.
  // Painted on the scratch canvas first: with 'source-in' every fill would
  // clear what the previous tile left.
  paint ??= document.createElement('canvas')
  paint.width = canvas.width // also clears it
  paint.height = canvas.height
  const pctx = paint.getContext('2d')
  if (!pctx) return
  pctx.scale(res, res)
  pctx.translate(-x, -y)
  const size = s.backgroundSize.split(' ')[0]
  const tile = size.endsWith('px') ? Number.parseFloat(size) : w
  const posX = s.backgroundPositionX
  const pos = posX.endsWith('%') ? (w - tile) * Number.parseFloat(posX) / 100 : Number.parseFloat(posX) || 0
  const offset = pos % tile
  for (let tx = offset > 0 ? offset - tile : offset; tx < w; tx += tile) {
    if (tx + tile < x || tx > x + cw) continue // outside the canvas
    pctx.fillStyle = linearGradient(pctx, s.backgroundImage, tx, tile, h)
    pctx.fillRect(tx, 0, tile, h)
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.globalCompositeOperation = 'source-in'
  ctx.drawImage(paint, 0, 0)

  // Only now that the image is complete: keep the original for layout and
  // text selection, hide its paint
  if (s.position === 'static') el.style.position = 'relative'
  el.style.setProperty('background', 'none', 'important')
  el.style.setProperty('-webkit-text-fill-color', 'transparent', 'important')
  el.appendChild(canvas)
}

// The gradient's first color stop
function solidColor(image: string) {
  const args = functionArgs(image)
  if (/^-?[\d.]+(deg|turn|rad)$/.test(args[0]) || args[0] in SIDES) args.shift()
  return colorStops(args)[0]?.[1]
}

// For an editable PPTX export: gradient text, redrawn (the canvases are
// dropped) or not yet, is painted in its gradient's first color, nested
// gradient text included
export function solidifyGradientText(root: Document) {
  for (const el of root.querySelectorAll<HTMLElement>('*')) {
    const done = el.closest(`[${GRADIENT_DONE}]`)
    if (done && done !== el) continue // handled with its redrawn ancestor
    const s = getComputedStyle(el)
    const image = el.getAttribute(GRADIENT_DONE) ?? (isGradientText(s) ? s.backgroundImage : '')
    const color = image && solidColor(image)
    if (!color) continue
    for (const canvas of el.querySelectorAll('canvas.print-gradient-text')) canvas.remove()
    for (const node of [el, ...el.querySelectorAll<HTMLElement>('*')]) {
      if (!isTransparent(getComputedStyle(node).webkitTextFillColor)) continue
      node.style.setProperty('background', 'none', 'important')
      node.style.setProperty('color', color, 'important')
      node.style.setProperty('-webkit-text-fill-color', color, 'important')
    }
  }
}
