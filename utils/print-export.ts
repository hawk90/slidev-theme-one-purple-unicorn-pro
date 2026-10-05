// PDF/PNG export.
//
// html.print-mode marks an export (`slidev export`, the browser export page) and
// browser printing; the CSS print rules (static animations, hidden timers…)
// hang off it. `slidev export` renders with screen media, so `@media print`
// alone would miss it.
//
// In an export, effects that PDF viewers draw wrongly are redrawn as images:
// gradient text (print-gradient-text.ts), masked border rings and blurred
// shadows (print-effects.ts).

import { GRADIENT_DONE, isGradientText, materializePseudo, PSEUDO, redrawGradientText } from './print-gradient-text'
import { redrawBoxShadow, redrawRing, redrawTextShadows, RING_DONE } from './print-effects'
import { isPrintMode } from './print-mode'

const OWN = 'canvas.print-gradient-text, canvas.print-ring, canvas.print-shadows'
// Slide content and the theme's slide chrome (global-top / global-bottom)
const SLIDE = '.slidev-layout, .progress-bar, .slide-indicator, .stage-progress'

// Slide elements in `root` (the root itself included)
function slideElements(root: Element | Document) {
  const all = root instanceof Element ? [root, ...root.querySelectorAll('*')] : [...root.querySelectorAll('*')]
  return all.filter(el => el.closest(SLIDE) && !el.matches(OWN)) as HTMLElement[]
}

function redraw(root: Element | Document) {
  // Gradient ::before / ::after become real elements first
  for (const el of slideElements(root)) {
    if (el.hasAttribute(PSEUDO) || el.closest(`[${GRADIENT_DONE}]`)) continue
    if (!el.classList.contains('print-no-before')) materializePseudo(el, '::before')
    if (!el.classList.contains('print-no-after')) materializePseudo(el, '::after')
  }
  const els = slideElements(root)
  for (const el of els) {
    if (el.hasAttribute(RING_DONE)) continue
    if (!el.classList.contains('print-no-before')) redrawRing(el, '::before')
    if (!el.classList.contains('print-no-after')) redrawRing(el, '::after')
  }
  for (const el of els) redrawBoxShadow(el, getComputedStyle(el))
  redrawTextShadows(els)
  // Document order: an outer gradient element is redrawn with its children's
  // text before the children come up, so they are skipped
  for (const el of els) {
    if (el.closest(`[${GRADIENT_DONE}]`)) continue
    const s = getComputedStyle(el)
    if (isGradientText(s)) redrawGradientText(el, s)
  }
}

let started = false

function start() {
  started = true
  // `slidev export` waits for .slidev-slide-loading to be removed before it
  // captures, so hold the capture until the slides have settled and been redrawn
  const hold = document.createElement('div')
  hold.className = 'slidev-slide-loading'
  hold.style.display = 'none'
  document.body.appendChild(hold)

  // A full pass once the slides have settled, then only what is added later
  // (e.g. another range on the browser export page)
  let pending: Set<Element> | null = null
  let timer: number | undefined
  const schedule = () => {
    clearTimeout(timer)
    timer = window.setTimeout(async () => {
      await document.fonts.ready
      if (!isPrintMode()) return
      if (pending === null) {
        redraw(document)
        pending = new Set()
        hold.remove()
        return
      }
      const roots = [...pending].filter(r => r.isConnected)
      pending.clear()
      for (const r of roots) {
        if (!roots.some(o => o !== r && o.contains(r))) redraw(r)
      }
    }, 300)
  }
  new MutationObserver((mutations) => {
    let added = false
    for (const m of mutations) {
      m.addedNodes.forEach((n) => {
        if (!(n instanceof Element) || n.matches(OWN) || n.hasAttribute(PSEUDO)) return
        pending?.add(n)
        added = true
      })
    }
    if (added) schedule()
  }).observe(document.body, { childList: true, subtree: true })
  schedule()
}

export function setupPrintExport(router?: { afterEach: (hook: () => void) => unknown }) {
  const sync = () => {
    const on = isPrintMode()
    document.documentElement.classList.toggle('print-mode', on)
    if (on && !started) start()
  }
  sync()
  router?.afterEach(() => setTimeout(sync))

  // Browser printing of the presentation itself: the CSS print rules only
  window.addEventListener('beforeprint', () => document.documentElement.classList.add('print-mode'))
  window.addEventListener('afterprint', sync)
}
