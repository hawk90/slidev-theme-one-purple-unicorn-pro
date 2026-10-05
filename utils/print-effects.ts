// Border rings and shadows in PDF export.
//
// Two kinds of CSS that PDF viewers draw wrongly when Chromium writes them:
// - Masked rings (.anim-border's light, `mask-composite: exclude`): the mask is
//   dropped, so the whole box is filled with the gradient.
// - Blurred shadows (box-shadow, text-shadow): macOS Preview / PDFKit drops
//   them and paints a translucent rectangle instead.
// Both are drawn on canvases instead, which every viewer shows the same.

import { colorStops, cornerRadii, fillRun, functionArgs, overlayCanvas, paddingBox, RESOLUTION, roundRect, splitList, textRuns } from './print-canvas'

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

export function redrawRing(el: HTMLElement, which: '::before' | '::after') {
  const ps = getComputedStyle(el, which)
  if (!isMaskedRing(ps)) return
  el.setAttribute(RING_DONE, '')
  const { width: w, height: h } = paddingBox(el)
  if (!w || !h) return
  const width = Number.parseFloat(ps.paddingTop) || 0
  const radii = cornerRadii(ps)
  const { canvas, ctx } = overlayCanvas('print-ring', w, h)
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

// Shadows are drawn on one layer per host, under the host's content: the
// nearest positioned ancestor with a background (a card, the progress bar),
// else the slide. A shadow under an opaque card would be hidden there anyway,
// as in CSS.
const MARGIN = 48
const layers = new WeakMap<HTMLElement, { ctx: CanvasRenderingContext2D, box: ReturnType<typeof paddingBox> }>()

function hasBackground(s: CSSStyleDeclaration) {
  return s.backgroundImage !== 'none' || !/rgba\([^)]*,\s*0\)$|transparent/.test(s.backgroundColor)
}

function layerFor(el: HTMLElement) {
  let host = el.parentElement
  while (host && !host.classList.contains('slidev-layout')) {
    const s = getComputedStyle(host)
    if (s.position !== 'static' && hasBackground(s)) break
    host = host.parentElement
  }
  if (!host) return null
  let layer = layers.get(host)
  if (!layer) {
    // The layer reaches MARGIN px past the host, where shadows can spread
    // (what the host or the slide clips is clipped here too)
    const box = paddingBox(host)
    const { canvas, ctx } = overlayCanvas('print-shadows', box.width + 2 * MARGIN, box.height + 2 * MARGIN)
    canvas.style.left = canvas.style.top = `${-MARGIN}px`
    canvas.style.zIndex = '-1'
    ctx.translate(MARGIN, MARGIN)
    host.style.isolation = 'isolate' // keep the layer above the host's background
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative'
    host.prepend(canvas)
    layer = { ctx, box }
    layers.set(host, layer)
  }
  return layer
}

// Canvas shadows ignore the transform, so they are given in canvas pixels. The
// shape is drawn far outside the canvas and only its shadow lands in place.
const FAR = 100000
function withShadow(ctx: CanvasRenderingContext2D, s: Shadow, draw: () => void) {
  ctx.save()
  ctx.shadowColor = s.color
  ctx.shadowBlur = s.blur * RESOLUTION
  ctx.shadowOffsetX = (FAR + s.x) * RESOLUTION
  ctx.shadowOffsetY = s.y * RESOLUTION
  ctx.translate(-FAR, 0)
  ctx.fillStyle = '#000'
  draw()
  ctx.restore()
}

export function redrawBoxShadow(el: HTMLElement, s: CSSStyleDeclaration) {
  if (el.hasAttribute(BOX_SHADOW_DONE)) return
  const shadows = parseShadows(s.boxShadow, true)
  if (!shadows.length || s.visibility === 'hidden' || s.opacity === '0') return
  const r = el.getBoundingClientRect()
  if (!r.width || !r.height) return
  const layer = layerFor(el)
  if (!layer) return
  el.setAttribute(BOX_SHADOW_DONE, '')
  const { ctx, box } = layer
  const x = (r.left - box.left) / box.zoom
  const y = (r.top - box.top) / box.zoom
  const w = r.width / box.zoom
  const h = r.height / box.zoom
  const radii = cornerRadii(s)
  // The first shadow is on top, so draw the list backwards
  for (const sh of [...shadows].reverse()) {
    withShadow(ctx, sh, () => {
      ctx.beginPath()
      roundRect(ctx, x - sh.spread, y - sh.spread, w + 2 * sh.spread, h + 2 * sh.spread, radii.map(c => c + sh.spread))
      ctx.fill()
    })
  }
  // An outer shadow is not painted under its own box
  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  roundRect(ctx, x, y, w, h, radii)
  ctx.fill()
  ctx.restore()
  el.style.setProperty('box-shadow', 'none', 'important')
}

// text-shadow is inherited, so it is handled per text node: every element
// whose own text has a shadow gets it drawn on the layer. All values are read
// before any is turned off (turning one off changes what its children inherit).
export function redrawTextShadows(elements: HTMLElement[]) {
  const jobs = elements.flatMap((el) => {
    if (el.hasAttribute(TEXT_SHADOW_DONE)) return []
    const s = getComputedStyle(el)
    const shadows = parseShadows(s.textShadow, false)
    if (!shadows.length || s.visibility === 'hidden' || s.opacity === '0') return []
    const runs = textRuns(el, () => true).filter(run => run.parent === el)
    return runs.length ? [{ el, shadows, runs }] : []
  })
  for (const { el, shadows, runs } of jobs) {
    const layer = layerFor(el)
    if (!layer) continue
    const { ctx, box } = layer
    for (const sh of [...shadows].reverse()) {
      withShadow(ctx, sh, () => {
        for (const run of runs) fillRun(ctx, run, box.left, box.top, box.zoom)
      })
    }
  }
  for (const { el } of jobs) {
    el.setAttribute(TEXT_SHADOW_DONE, '')
    el.style.setProperty('text-shadow', 'none', 'important')
  }
}
