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

const DONE = 'data-print-gradient'
const RESOLUTION = 4 // canvas pixels per CSS pixel

const isPrintMode = () =>
  new URLSearchParams(location.search).has('print') || /\/export\b/.test(location.pathname)

const isTransparent = (color: string) =>
  color === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(color)

const isGradientStyle = (s: CSSStyleDeclaration) =>
  s.backgroundClip === 'text' && s.backgroundImage.startsWith('linear-gradient')
  && isTransparent(s.webkitTextFillColor)

const isGradientText = (el: Element) => isGradientStyle(getComputedStyle(el))

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

// Text of `el` painted by its gradient, split into one run per line
function textRuns(el: Element) {
  const runs: { text: string, parent: Element, rects: DOMRect[] }[] = []
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    const parent = node.parentElement
    if (!parent || !isTransparent(getComputedStyle(parent).webkitTextFillColor)) continue
    let run: (typeof runs)[number] | null = null
    for (let i = 0; i < node.data.length; i++) {
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      const r = range.getClientRects()[0]
      if (!r || r.width === 0) continue // collapsed whitespace
      if (!run || Math.abs(r.top - run.rects[0].top) > 1) {
        run = { text: '', parent, rects: [] }
        runs.push(run)
      }
      run.text += node.data[i]
      run.rects.push(r)
    }
  }
  return runs
}

function redraw(el: HTMLElement) {
  el.setAttribute(DONE, '')

  const s = getComputedStyle(el)
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
    const first = run.rects[0]
    const width = (run.rects.at(-1)!.right - first.left) / zoom
    ctx.save()
    ctx.translate((first.left - left) / zoom, (first.top - top) / zoom + m.fontBoundingBoxAscent)
    if (m.width > 0) ctx.scale(width / m.width, 1) // match the laid-out width exactly
    ctx.fillText(run.text, 0, 0)
    ctx.restore()
  }

  // 2. The gradient (tiled like the background), kept only where the text is.
  // Painted on its own canvas first: with 'source-in' every fill would clear
  // what the previous tile left.
  const paint = document.createElement('canvas')
  paint.width = canvas.width
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

function redrawAll() {
  for (const el of document.querySelectorAll('.slidev-layout, .slidev-layout *')) {
    if (el.closest(`[${DONE}]`) || el.classList.contains('print-gradient-text')) continue
    if (!el.classList.contains('print-no-before')) materializePseudo(el, '::before')
    if (!el.classList.contains('print-no-after')) materializePseudo(el, '::after')
  }
  // Document order: an outer gradient element is redrawn (with its children's
  // text) before its children are visited, so they are skipped
  for (const el of document.querySelectorAll<HTMLElement>('.slidev-layout, .slidev-layout *')) {
    if (el.closest(`[${DONE}]`) || el.classList.contains('print-gradient-text')) continue
    if (isGradientText(el)) redraw(el)
  }
}

export function setupPrintGradientText() {
  if (!isPrintMode()) return

  // `slidev export` waits for .slidev-slide-loading to be removed before it
  // captures, so hold the capture until the slides have settled and been redrawn
  const style = document.createElement('style')
  style.textContent = '.print-no-before::before, .print-no-after::after { content: none !important; }'
  document.head.appendChild(style)

  const hold = document.createElement('div')
  hold.className = 'slidev-slide-loading'
  hold.style.display = 'none'
  document.body.appendChild(hold)

  let timer: number | undefined
  const schedule = () => {
    clearTimeout(timer)
    timer = window.setTimeout(async () => {
      await document.fonts.ready
      redrawAll()
      hold.remove()
    }, 300)
  }
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true })
  schedule()
}
