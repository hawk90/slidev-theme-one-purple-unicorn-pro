// Shrink a slide's content to fit (`fit: true` on a slide, or in the
// headmatter for every slide; a slide's `fit: false` turns it off there).
// Opt-in: a slide that doesn't overflow is left alone.
//
// - The content (not the title, not absolutely placed layers) is zoomed down
//   in steps until the slide no longer overflows, never below FLOOR (0.42);
//   still too tall at the floor, the slide gets `data-fit-overflow` and a
//   console warning names it.
// - A display formula (KaTeX) wider than its box gets a smaller font, to the
//   same floor.
// Skipped on a slide with its own `zoom:` (Slidev scales the whole slide
// then) and when slidev-addon-autofit is in the deck's addons. Run when a
// slide is shown, and for each page of an export.

export const FLOOR = 0.42
const STEP = 0.04

/** The scale to try first: what fits if everything shrank evenly */
export function fitScale(available: number, needed: number, floor = FLOOR): number {
  if (needed <= available || needed <= 0) return 1
  return Math.max(floor, Math.floor((available / needed) * 100) / 100)
}

/** Whether the deck uses slidev-addon-autofit (it does this itself) */
export const hasAutofitAddon = (addons: unknown) =>
  Array.isArray(addons) && addons.some(a => /(^|\/|-)autofit$/.test(String(a)))

// Whether the content reaches past the layout's bottom padding, less
// `reserve` px kept free (the footer line, when it shows). Measured from the
// parts' boxes: scrollHeight never drops below the box, so it can't tell how
// much room is left. The slide is scaled to the window: rects are divided back
function overflows(root: HTMLElement, own: HTMLElement[], reserve = 0) {
  const box = root.getBoundingClientRect()
  const ratio = box.height / root.offsetHeight || 1
  const bottom = Math.max(box.top, ...own.map(p => p.getBoundingClientRect().bottom))
  const padding = Number.parseFloat(getComputedStyle(root).paddingBottom) || 0
  return (bottom - box.top) / ratio + padding > root.clientHeight - reserve + 1
}

/**
 * Whether a slide's content runs out of the slide (the dev overflow warning):
 * past its box, not into its bottom padding, since columns, `.stretch` and
 * scrolling layouts fill the box by design. Each part in the flow is
 * measured with its own overflow (a column's), so decorations placed
 * absolutely (a Ghost glyph bleeding off the edge) don't count; boxes inside
 * that clip aren't looked at: components clip on purpose (a pan-zoom).
 */
export function slideOverflows(root: HTMLElement): boolean {
  // the layouts' columns scroll silently when they run over: that counts
  for (const col of root.querySelectorAll<HTMLElement>('.grid-col'))
    if (col.scrollHeight > col.clientHeight + 2) return true
  const box = root.getBoundingClientRect()
  const ratio = box.height / root.offsetHeight || 1
  return parts(root).some((p) => {
    const top = (p.getBoundingClientRect().top - box.top) / ratio
    const scrolls = /auto|scroll/.test(getComputedStyle(p).overflowY) // a scrolling part (layout: document) is meant to
    return top + (scrolls ? p.offsetHeight : Math.max(p.offsetHeight, p.scrollHeight)) > root.clientHeight + 2
  })
}

/** The parts to shrink: the layout's children in the flow, not the title */
function parts(root: HTMLElement): HTMLElement[] {
  return [...root.children].filter((c): c is HTMLElement => {
    if (!(c instanceof HTMLElement)) return false
    const pos = getComputedStyle(c).position
    return pos !== 'absolute' && pos !== 'fixed'
  })
}

/** Fit one slide's layout root; returns the scale used (1: untouched) */
export function fitSlide(root: HTMLElement, label = '', reserve = 0): number {
  // Column layouts (two-cols, three-cols): the column grid always reaches the
  // bottom (flex: 1) and its columns scroll, so its box says nothing: the
  // columns' content is shrunk and measured, and the header (the title) stays
  const cols = [...root.querySelectorAll<HTMLElement>('.grid-col')]
  const own = cols.length ? cols : parts(root)
  own.forEach(p => p.style.removeProperty('zoom'))
  root.removeAttribute('data-fit-overflow')
  fitMath(root)
  const over = cols.length
    ? () => cols.some(c => c.scrollHeight > c.clientHeight + 1)
    : () => overflows(root, own, reserve)
  if (!over()) return 1

  let scale = cols.length // a first guess
    ? fitScale(1, Math.max(...cols.map(c => c.scrollHeight / (c.clientHeight || 1))))
    : fitScale(root.clientHeight - reserve, root.scrollHeight)
  const apply = (s: number) => own.forEach(p => p.style.setProperty('zoom', String(s)))
  apply(scale)
  while (over() && scale > FLOOR) {
    scale = Math.max(FLOOR, Math.round((scale - STEP) * 100) / 100)
    apply(scale)
  }
  if (over()) {
    root.setAttribute('data-fit-overflow', '')
    console.warn(`[theme] fit: ${label || 'a slide'} still overflows at ${FLOOR}× — split it`)
  }
  return scale
}

/** Display formulas wider than their box: a smaller font, to the floor */
export function fitMath(root: HTMLElement) {
  for (const d of root.querySelectorAll<HTMLElement>('.katex-display')) {
    d.style.removeProperty('font-size')
    const box = d.clientWidth
    const need = d.scrollWidth
    if (need > box + 1 && box > 0) d.style.fontSize = `${Math.max(FLOOR, Math.floor((box / need) * 100) / 100)}em`
  }
}

/** In an export: fit every page whose chrome layer asked for it (the
 *  `.fit-marker` global-bottom.vue renders next to the slide); called by
 *  print-export.ts before it redraws, so the redraws see the fitted sizes */
export function fitMarked(root: ParentNode) {
  for (const marker of root.querySelectorAll<HTMLElement>('.fit-marker')) {
    const layout = marker.parentElement?.querySelector<HTMLElement>('.slidev-layout')
    if (layout) fitSlide(layout, marker.dataset.page ? `slide ${marker.dataset.page}` : '', Number(marker.dataset.reserve) || 0)
  }
}
