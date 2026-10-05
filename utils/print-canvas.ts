// Shared pieces for redrawing slide effects as images in PDF export
// (see print-export.ts): canvas setup, CSS value parsing, text measurement.

export const RESOLUTION = 4 // canvas pixels per CSS pixel

export const isTransparent = (color: string) =>
  color === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(color)

// Split a CSS list at top-level commas: "a, f(b, c), d" → ["a", "f(b, c)", "d"]
export function splitList(value: string) {
  const out: string[] = []
  let depth = 0
  let cur = ''
  for (const ch of value) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = '' }
    else cur += ch
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}

// Arguments of a CSS function: "linear-gradient(90deg, red, blue)" → ["90deg", "red", "blue"]
export const functionArgs = (value: string) =>
  splitList(value.slice(value.indexOf('(') + 1, value.lastIndexOf(')')))

// Color stops "color [pos%]" as [offset 0..1, color]; missing offsets are
// spread evenly between their neighbours, as CSS does
export function colorStops(args: string[], length = 1) {
  const stops = args.map((a) => {
    const m = a.match(/^(.*?)(?:\s+(-?[\d.]+)(%|px|deg))?$/)!
    const pos = m[2] === undefined
      ? null
      : m[3] === '%' ? Number(m[2]) / 100 : m[3] === 'deg' ? Number(m[2]) / 360 : Number(m[2]) / length
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
  return stops.map(s => [Math.min(1, Math.max(0, s.pos!)), s.color] as const)
}

// The padding box of `el` in viewport coordinates, and the slide's scale
// (slides are scaled with a transform, layout sizes are not)
export function paddingBox(el: HTMLElement) {
  const r = el.getBoundingClientRect()
  const zoom = el.offsetWidth ? r.width / el.offsetWidth : 1
  return {
    left: r.left + el.clientLeft * zoom,
    top: r.top + el.clientTop * zoom,
    width: el.clientWidth,
    height: el.clientHeight,
    zoom,
  }
}

// An absolutely placed canvas covering w×h CSS px, drawn at RESOLUTION
export function overlayCanvas(className: string, w: number, h: number) {
  const canvas = document.createElement('canvas')
  canvas.className = className
  canvas.setAttribute('aria-hidden', 'true')
  canvas.width = Math.ceil(w * RESOLUTION)
  canvas.height = Math.ceil(h * RESOLUTION)
  Object.assign(canvas.style, {
    position: 'absolute', left: '0', top: '0', width: `${w}px`, height: `${h}px`,
    pointerEvents: 'none',
  })
  const ctx = canvas.getContext('2d')!
  ctx.scale(RESOLUTION, RESOLUTION)
  return { canvas, ctx }
}

// Corner radii [top-left, top-right, bottom-right, bottom-left] in px
export const cornerRadii = (s: CSSStyleDeclaration) =>
  [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius]
    .map(v => Number.parseFloat(v) || 0)

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radii: number[]) {
  const max = Math.min(w, h) / 2
  ctx.roundRect(x, y, w, h, radii.map(r => Math.max(0, Math.min(r, max))))
}

export interface TextRun { text: string, parent: Element, left: number, top: number, right: number }

let range: Range // created on first use (the module also loads outside the browser)
function charRect(node: Text, i: number) {
  range.setStart(node, i)
  range.setEnd(node, i + 1)
  const r = range.getClientRects()[0]
  return r && r.width > 0 ? r : null
}

// Text inside `el` as laid out, one run per line, for the text nodes whose
// parent passes `accept`. A text node on one line (the usual case) is measured
// as a whole; only a node that wraps is measured per character to find its
// line breaks.
export function textRuns(el: Element, accept: (parent: CSSStyleDeclaration) => boolean) {
  const runs: TextRun[] = []
  range ??= document.createRange()
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    const parent = node.parentElement
    if (!parent) continue
    const ps = getComputedStyle(parent)
    if (!accept(ps)) continue

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

    let run: TextRun | null = null
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

// Draw a text run with its parent's font at the laid-out position, stretched
// to the laid-out width. (x0, y0, zoom) map viewport to canvas coordinates.
export function fillRun(ctx: CanvasRenderingContext2D, run: TextRun, x0: number, y0: number, zoom: number) {
  const ps = getComputedStyle(run.parent)
  ctx.font = `${ps.fontStyle} ${ps.fontWeight} ${ps.fontSize} ${ps.fontFamily}`
  ctx.letterSpacing = ps.letterSpacing === 'normal' ? '0px' : ps.letterSpacing
  const m = ctx.measureText(run.text)
  ctx.save()
  ctx.translate((run.left - x0) / zoom, (run.top - y0) / zoom + m.fontBoundingBoxAscent)
  if (m.width > 0) ctx.scale((run.right - run.left) / zoom / m.width, 1)
  ctx.fillText(run.text, 0, 0)
  ctx.restore()
}
