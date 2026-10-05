// Moves the .anim-border light along the border at a constant speed.
// CSS alone can only rotate a conic gradient around the center, which races
// along the long edges of wide boxes and crawls at the corners. Here each
// element gets corner keyframes timed by the distance along its own border.
// Without this script (or without pseudo-element animation support) the
// CSS conic rotation stays as the fallback.

const REF_PERIMETER = 600 // px; a box this size takes --ab-duration per lap

const running = new WeakMap<Element, Animation>()

function animate(el: HTMLElement) {
  running.get(el)?.cancel()
  // offsetWidth/Height: layout size, unaffected by the slide's CSS scaling
  const bw = el.offsetWidth
  const bh = el.offsetHeight
  if (!bw || !bh) return
  const perimeter = 2 * (bw + bh)
  // Corners as keyframes, each offset proportional to the distance travelled,
  // so the light moves at one speed along every edge (linear easing)
  const corners: [number, number, number][] = [
    [0, 0, 0],
    [bw, 0, bw],
    [bw, bh, bw + bh],
    [0, bh, 2 * bw + bh],
    [0, 0, perimeter],
  ]
  const frames = corners.map(([x, y, d]) => ({ '--ab-x': `${x}px`, '--ab-y': `${y}px`, offset: d / perimeter }))
  const seconds = Number.parseFloat(getComputedStyle(el).getPropertyValue('--ab-duration')) || 6
  try {
    const anim = el.animate(frames, {
      pseudoElement: '::before',
      duration: (seconds * 1000 * perimeter) / REF_PERIMETER,
      iterations: Number.POSITIVE_INFINITY,
      direction: el.classList.contains('anim-border-ccw') ? 'reverse' : 'normal',
    })
    running.set(el, anim)
    el.classList.add('ab-beam')
  }
  catch {
    el.classList.remove('ab-beam') // keep the CSS fallback
  }
}

// PDF/PNG export (?print or /export): keep the static CSS ring instead of a
// light frozen at some point of its path
const isPrintMode = () =>
  new URLSearchParams(location.search).has('print') || /\/export\b/.test(location.pathname)

export function setupBorderBeams() {
  if (typeof window === 'undefined' || !('animate' in Element.prototype)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (isPrintMode()) return

  const resize = new ResizeObserver(entries => entries.forEach(e => animate(e.target as HTMLElement)))
  const watch = (root: ParentNode) =>
    root.querySelectorAll?.('.anim-border').forEach(el => resize.observe(el))

  watch(document)
  new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes.forEach((n) => {
        if (!(n instanceof HTMLElement)) return
        if (n.classList.contains('anim-border')) resize.observe(n)
        watch(n)
      })
      m.removedNodes.forEach((n) => {
        if (!(n instanceof HTMLElement)) return
        const els = n.classList.contains('anim-border') ? [n] : [...n.querySelectorAll('.anim-border')]
        els.forEach((el) => { resize.unobserve(el); running.get(el)?.cancel() })
      })
    }
  }).observe(document.body, { childList: true, subtree: true })

  // Browser print: show the static ring
  window.matchMedia('print').addEventListener('change', (e) => {
    document.querySelectorAll<HTMLElement>('.anim-border').forEach((el) => {
      if (e.matches) { running.get(el)?.cancel(); el.classList.remove('ab-beam') }
      else animate(el)
    })
  })
}
