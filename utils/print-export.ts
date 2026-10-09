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

import { GRADIENT_DONE, isGradientText, materializePseudo, PSEUDO, redrawGradientText, solidifyGradientText } from './print-gradient-text'
import type { TextShadowJob } from './print-effects'
import { redrawBoxShadow, redrawRing, redrawTextShadows, RING_DONE, textShadowJob } from './print-effects'
import { canRedraw } from './print-canvas'
import { isPrintMode } from './print-mode'

const HOLD_MS = 15000
const OWN = 'canvas.print-gradient-text, canvas.print-ring, canvas.print-shadows'
// Slide content and the theme's slide chrome (global-top / global-bottom)
const SLIDE = '.slidev-layout, .progress-bar, .slide-indicator, .stage-progress'

// Slide elements in `root` (the root itself included)
function slideElements(root: Element | Document) {
  const all = root instanceof Element ? [root, ...root.querySelectorAll('*')] : [...root.querySelectorAll('*')]
  return all.filter(el => el.closest(SLIDE) && !el.matches(OWN)) as HTMLElement[]
}

// Every redraw step only replaces an effect once its image is complete, so a
// step that fails leaves that effect to the CSS; the others carry on
let failures = 0
function attempt(step: () => void) {
  try {
    step()
  }
  catch (e) {
    report(e)
  }
}
function report(e: unknown) {
  if (failures++ < 3) console.warn('[theme] PDF export: an effect is left as CSS:', e)
}

function redraw(root: Element | Document) {
  // Pseudo-elements: gradient ones become real elements, masked rings images
  for (const el of slideElements(root)) {
    if (el.hasAttribute(PSEUDO) || el.closest(`[${GRADIENT_DONE}]`)) continue
    for (const which of ['::before', '::after'] as const) {
      if (el.classList.contains(which === '::before' ? 'print-no-before' : 'print-no-after')) continue
      const ps = getComputedStyle(el, which)
      if (ps.content === 'none') continue
      attempt(() => materializePseudo(el, which, ps))
      if (!el.hasAttribute(RING_DONE)) attempt(() => redrawRing(el, which, ps))
    }
  }
  // Then each element once: its box shadow, its gradient text, and its text
  // shadow, which is drawn after all are read (see redrawTextShadows)
  const textShadows: TextShadowJob[] = []
  for (const el of slideElements(root)) {
    const s = getComputedStyle(el)
    attempt(() => redrawBoxShadow(el, s))
    const job = textShadowJob(el, s)
    if (job) textShadows.push(job)
    // Document order: an outer gradient element is redrawn with its
    // children's text before the children come up, so they are skipped
    if (isGradientText(s) && !editable && !el.closest(`[${GRADIENT_DONE}]`)) attempt(() => redrawGradientText(el, s))
  }
  redrawTextShadows(textShadows, report)
}

let started = false
let editable = false

// `slidev export --format pptx-editable` loads the same ?print page as a PDF
// export; what tells it apart is the style it adds right before it reads the
// DOM. The observer runs before that read (a separate call into the page).
const PPTX_EDITABLE_STYLE = 'animation-play-state: paused !important'
function watchEditableExport() {
  new MutationObserver((mutations) => {
    if (editable) return
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (n instanceof HTMLStyleElement && n.textContent?.includes(PPTX_EDITABLE_STYLE)) {
          editable = true
          attempt(() => solidifyGradientText(document))
          return
        }
      }
    }
  }).observe(document.head, { childList: true })
}

function start() {
  started = true
  watchEditableExport()
  // `slidev export` waits for .slidev-slide-loading to be removed before it
  // captures, so hold the capture until the slides have settled and been redrawn
  // (at most HOLD_MS: a font that never loads must not stall the export)
  const hold = document.createElement('div')
  hold.className = 'slidev-slide-loading'
  hold.style.display = 'none'
  document.body.appendChild(hold)
  setTimeout(() => hold.remove(), HOLD_MS)

  // A full pass once the slides have settled, then only what is added later
  // (e.g. another range on the browser export page)
  let pending: Set<Element> | null = null
  let timer: number | undefined
  const schedule = () => {
    clearTimeout(timer)
    timer = window.setTimeout(async () => {
      try {
        await document.fonts.ready
        if (!isPrintMode() || !canRedraw()) return
        if (pending === null) {
          pending = new Set()
          redraw(document)
          return
        }
        const roots = [...pending].filter(r => r.isConnected)
        pending.clear()
        for (const r of roots) {
          if (!roots.some(o => o !== r && o.contains(r))) redraw(r)
        }
      }
      catch (e) {
        report(e)
      }
      finally {
        hold.remove()
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
