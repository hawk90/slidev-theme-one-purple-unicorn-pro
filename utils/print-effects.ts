// Border rings and shadows in PDF export.
//
// Two kinds of CSS that PDF viewers draw wrongly when Chromium writes them:
// - Masked rings (.anim-border's light, `mask-composite: exclude`): the mask is
//   dropped, so the whole box is filled with the gradient.
// - Blurred shadows (box-shadow, text-shadow): macOS Preview / PDFKit drops
//   them and paints a translucent rectangle instead.
// Both are drawn on canvases instead, which every viewer shows the same.

import { colorStops, cornerRadii, fillRun, functionArgs, isTransparent, overlayCanvas, paddingBox, roundRect, splitList, textRuns } from './print-canvas'

export const RING_DONE = 'data-print-ring'
export const BOX_SHADOW_DONE = 'data-print-box-shadow'
export const TEXT_SHADOW_DONE = 'data-print-text-shadow'

// --- Rings ----------------------------------------------------------------

// A pseudo-element ring: padding = ring width, a conic gradient background and
// a mask that keeps only the padding area
function isMaskedRing(ps: CSSStyleDeclaration) {
  const composite = `${ps.maskComposite} ${ps.webkitMaskComposite}`
  return ps.content !== 'none' && ps.opacity !== '0'
    && /exclude|xor/.test(composite) && ps.backgroundImage.startsWith('conic-gradient')
}

function conicGradient(ctx: CanvasRenderingContext2D, image: string, w: number, h: number) {
  const args = functionArgs(image)
  let from = 0
  let cx = w / 2
  let cy = h / 2
  const head = args[0].match(/^(?:from\s+(-?[\d.]+)deg)?\s*(?:at\s+(-?[\d.]+)(%|px)\s+(-?[\d.]+)(%|px))?$/)
  if (head && (head[1] || head[2])) {
    args.shift()
    if (head[1]) from = Number(head[1])
    if (head[2]) {
      cx = head[3] === '%' ? w * Number(head[2]) / 100 : Number(head[2])
      cy = head[5] === '%' ? h * Number(head[4]) / 100 : Number(head[4])
    }
  }
  // CSS 0deg points up, canvas 0 points right
  const g = ctx.createConicGradient((from - 90) * Math.PI / 180, cx, cy)
  for (const [offset, color] of colorStops(args)) g.addColorStop(offset, color)
  return g
}

export function redrawRing(el: HTMLElement, which: '::before' | '::after', ps: CSSStyleDeclaration) {
  if (!isMaskedRing(ps)) return
  el.setAttribute(RING_DONE, '')
  const { width: w, height: h } = paddingBox(el)
  if (!w || !h) return
  const width = Number.parseFloat(ps.paddingTop) || 0
  const radii = cornerRadii(ps)
  const made = overlayCanvas('print-ring', w, h)
  if (!made) return
  const { canvas, ctx } = made
  ctx.beginPath()
  roundRect(ctx, 0, 0, w, h, radii)
  roundRect(ctx, width, width, w - 2 * width, h - 2 * width, radii.map(r => r - width))
  ctx.fillStyle = conicGradient(ctx, ps.backgroundImage, w, h)
  ctx.fill('evenodd')
  canvas.style.zIndex = ps.zIndex
  canvas.style.opacity = ps.opacity
  el.classList.add(which === '::before' ? 'print-no-before' : 'print-no-after')
  el.prepend(canvas)
}

// --- Shadows --------------------------------------------------------------

interface Shadow { color: string, x: number, y: number, blur: number, spread: number }

// Computed box-shadow / text-shadow: "rgb(…) 0px 10px 25px 0px, …"
function parseShadows(value: string, withSpread: boolean): Shadow[] {
  if (!value || value === 'none') return []
  return splitList(value).flatMap((item) => {
    if (/\binset\b/.test(item)) return [] // inner shadows are left to the browser
    const m = item.match(/^(.*?)\s+(-?[\d.]+)px\s+(-?[\d.]+)px(?:\s+(-?[\d.]+)px)?(?:\s+(-?[\d.]+)px)?$/)
    if (!m) return []
    return [{ color: m[1], x: Number(m[2]), y: Number(m[3]), blur: Number(m[4] ?? 0), spread: withSpread ? Number(m[5] ?? 0) : 0 }]
  })
}

// Each shadow gets its own canvas, just big enough for it, under the content
// of its host: the nearest positioned ancestor with a background (a card, the
// progress bar), else the slide. A shadow under an opaque card would be hidden
// there anyway, as in CSS. Blur is soft, so a lower resolution is enough.
const SHADOW_RESOLUTION = 2

// How far a shadow reaches past its shape: a CSS blur radius B is a Gaussian
// with σ = B/2, which fades out by 3σ
const reach = (sh: Shadow) => 1.5 * sh.blur + Math.max(0, sh.spread) + 1

const hasBackground = (s: CSSStyleDeclaration) =>
  s.backgroundImage !== 'none' || !isTransparent(s.backgroundColor)

function hostFor(el: HTMLElement) {
  let host = el.parentElement
  while (host && !host.classList.contains('slidev-layout')) {
    const s = getComputedStyle(host)
    if (s.position !== 'static' && hasBackground(s)) break
    host = host.parentElement
  }
  if (!host) return null
  // Read from the element, not remembered: an undone pass resets its style
  if (host.style.isolation !== 'isolate') {
    host.style.isolation = 'isolate' // keep the shadows above the host's background
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative'
  }
  // Measured each time: the export page scrolls between passes
  return { host, box: paddingBox(host) }
}

// A canvas for under the host's content covering the host-local rectangle
// [x0, x1] × [y0, y1]; drawing uses host-local CSS px. The caller adds it to
// the host once it is drawn.
function shadowCanvas(x0: number, y0: number, x1: number, y1: number) {
  const made = overlayCanvas('print-shadows', x1 - x0, y1 - y0, x0, y0, SHADOW_RESOLUTION)
  if (!made) return null
  made.canvas.style.zIndex = '-1'
  made.ctx.translate(-x0, -y0)
  return made
}

// Canvas shadows ignore the transform, so they are given in canvas pixels. The
// shape is drawn far outside the canvas and only its shadow lands in place.
const FAR = 100000
function withShadow(ctx: CanvasRenderingContext2D, res: number, sh: Shadow, draw: () => void) {
  ctx.save()
  ctx.shadowColor = sh.color
  ctx.shadowBlur = sh.blur * res
  ctx.shadowOffsetX = (FAR + sh.x) * res
  ctx.shadowOffsetY = sh.y * res
  ctx.translate(-FAR, 0)
  ctx.fillStyle = '#000'
  draw()
  ctx.restore()
}

// The host-local area a set of shadows of a w×h shape at (x, y) can reach
function shadowBounds(shadows: Shadow[], x: number, y: number, w: number, h: number) {
  return [
    Math.min(...shadows.map(sh => x + sh.x - reach(sh))),
    Math.min(...shadows.map(sh => y + sh.y - reach(sh))),
    Math.max(...shadows.map(sh => x + w + sh.x + reach(sh))),
    Math.max(...shadows.map(sh => y + h + sh.y + reach(sh))),
  ] as const
}

export function redrawBoxShadow(el: HTMLElement, s: CSSStyleDeclaration) {
  if (el.hasAttribute(BOX_SHADOW_DONE)) return
  const shadows = parseShadows(s.boxShadow, true)
  if (!shadows.length || s.visibility === 'hidden' || s.opacity === '0') return
  const r = el.getBoundingClientRect()
  if (!r.width || !r.height) return
  const found = hostFor(el)
  if (!found) return
  el.setAttribute(BOX_SHADOW_DONE, '')
  const { host, box } = found
  const x = (r.left - box.left) / box.zoom
  const y = (r.top - box.top) / box.zoom
  const w = r.width / box.zoom
  const h = r.height / box.zoom
  const radii = cornerRadii(s)
  const made = shadowCanvas(...shadowBounds(shadows, x, y, w, h))
  if (!made) return
  const { canvas, ctx, res } = made
  // The first shadow is on top, so draw the list backwards
  for (const sh of [...shadows].reverse()) {
    withShadow(ctx, res, sh, () => {
      ctx.beginPath()
      roundRect(ctx, x - sh.spread, y - sh.spread, w + 2 * sh.spread, h + 2 * sh.spread, radii.map(c => c + sh.spread))
      ctx.fill()
    })
  }
  // An outer shadow is not painted under its own box
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  roundRect(ctx, x, y, w, h, radii)
  ctx.fill()
  host.prepend(canvas)
  el.style.setProperty('box-shadow', 'none', 'important')
}

// text-shadow is inherited: each element whose own text has a shadow gets it
// drawn, and all values are read before any is turned off (turning one off
// changes what its children inherit)
export interface TextShadowJob { el: HTMLElement, shadows: Shadow[] }

export function textShadowJob(el: HTMLElement, s: CSSStyleDeclaration): TextShadowJob | null {
  if (el.hasAttribute(TEXT_SHADOW_DONE)) return null
  const shadows = parseShadows(s.textShadow, false)
  if (!shadows.length || s.visibility === 'hidden' || s.opacity === '0') return null
  return { el, shadows }
}

export function redrawTextShadows(jobs: TextShadowJob[], onError: (e: unknown) => void) {
  const drawn = jobs.filter(({ el, shadows }) => {
    try {
      return drawTextShadow(el, shadows)
    }
    catch (e) {
      onError(e)
      return false
    }
  })
  for (const { el } of drawn) {
    el.setAttribute(TEXT_SHADOW_DONE, '')
    el.style.setProperty('text-shadow', 'none', 'important')
  }
}

function drawTextShadow(el: HTMLElement, shadows: Shadow[]) {
  const runs = textRuns(el, () => true, true)
  const found = runs.length ? hostFor(el) : null
  if (!found) return false
  const { host, box } = found
  const local = (vx: number, vy: number) => [(vx - box.left) / box.zoom, (vy - box.top) / box.zoom]
  const [x, y] = local(Math.min(...runs.map(r => r.left)), Math.min(...runs.map(r => r.top)))
  const [x2, y2] = local(Math.max(...runs.map(r => r.right)), Math.max(...runs.map(r => r.bottom)))
  const made = shadowCanvas(...shadowBounds(shadows, x, y, x2 - x, y2 - y))
  if (!made) return false
  const { canvas, ctx, res } = made
  for (const sh of [...shadows].reverse()) {
    withShadow(ctx, res, sh, () => {
      for (const run of runs) fillRun(ctx, run, box.left, box.top, box.zoom)
    })
  }
  host.prepend(canvas)
  return true
}
