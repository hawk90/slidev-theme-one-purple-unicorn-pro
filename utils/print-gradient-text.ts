// Gradient text (CSS `background-clip: text`) in PDF export.
//
// Chromium writes it into a PDF as text used as a clip, and PDF viewers
// disagree on that: macOS Preview / PDFKit paint the whole gradient box or
// black text, poppler adds hairline box edges; SVG gradient text fails in
// other viewers. Each gradient-text element instead gets a canvas with its text
// painted in its gradient, laid over the original, which stays in place
// (invisible) for layout and text search.

import { colorStops, fillRun, functionArgs, isTransparent, overlayCanvas, paddingBox, RESOLUTION, textRuns } from './print-canvas'

export const GRADIENT_DONE = 'data-print-gradient'
export const PSEUDO = 'data-print-pseudo'

export const isGradientText = (s: CSSStyleDeclaration) =>
  s.backgroundClip === 'text' && s.backgroundImage.startsWith('linear-gradient')
  && isTransparent(s.webkitTextFillColor)

// A gradient ::before / ::after (e.g. the quote layout's closing mark) can't be
// measured or covered, so it is replaced by a real span with the same computed
// style and text, which is then redrawn like any other element
export function materializePseudo(el: Element, which: '::before' | '::after') {
  const ps = getComputedStyle(el, which)
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

export function redrawGradientText(el: HTMLElement, s: CSSStyleDeclaration) {
  el.setAttribute(GRADIENT_DONE, '')
  const box = paddingBox(el)
  const { width: w, height: h } = box
  if (!w || !h) return
  const { canvas, ctx } = overlayCanvas('print-gradient-text', w, h)

  // 1. The text, in any solid color, at the positions the browser laid it out
  for (const run of textRuns(el, ps => isTransparent(ps.webkitTextFillColor)))
    fillRun(ctx, run, box.left, box.top, box.zoom)

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
    pctx.fillStyle = linearGradient(pctx, s.backgroundImage, x, tile, h)
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
