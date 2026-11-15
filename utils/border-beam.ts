// Moves the .anim-border light along the border at a constant speed.
// CSS alone can only rotate a conic gradient around the center, which races
// along the long edges of wide boxes and crawls at the corners. Here each
// element gets corner keyframes timed by the distance along its own border.
// Without this script (or without pseudo-element animation support) the
// CSS conic rotation stays as the fallback.

import { isPrintMode } from './print-mode'
import { beamKeyframes, lapDuration } from './beam-path'


const running = new WeakMap<Element, Animation>()

function animate(el: HTMLElement) {
  running.get(el)?.cancel()
  // Reached the export page from the presentation: keep the static ring there
  if (isPrintMode()) { el.classList.remove('ab-beam'); return }
  // offsetWidth/Height: layout size, unaffected by the slide's CSS scaling
  const bw = el.offsetWidth
  const bh = el.offsetHeight
  if (!bw || !bh) return
  // The light's radius stays under the box height (animations.css), or on a
  // short box it reaches the opposite edge at a corner and looks like two
  el.style.setProperty('--_ab-len-max', `${Math.round(0.75 * Math.min(bw, bh))}px`)
  // Corners as keyframes at one speed along every edge (beam-path.ts)
  try {
    const anim = el.animate(beamKeyframes(bw, bh), {
      pseudoElement: '::before',
      duration: lapDuration(getComputedStyle(el).getPropertyValue('--ab-duration'), bw, bh),
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

export function setupBorderBeams() {
  if (typeof window === 'undefined' || !('animate' in Element.prototype)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  // PDF/PNG export: keep the static CSS ring instead of a light frozen at some
  // point of its path
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
