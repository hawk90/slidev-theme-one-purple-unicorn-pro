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
import { isPrintMode, trackPrintRoute } from './print-mode'

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

// What the redraws changed, so a pass can be undone (see watchColorScheme):
// each attribute's value before the first change, and the nodes added
const journal = new Map<Element, Map<string, string | null>>()
const addedNodes: Node[] = []

function redraw(root: Element | Document) {
  const recorder = new MutationObserver(() => {})
  recorder.observe(document.body, { subtree: true, childList: true, attributes: true, attributeOldValue: true })
  try {
    redrawEffects(root)
  }
  finally {
    for (const r of recorder.takeRecords()) {
      if (r.type === 'childList') {
        addedNodes.push(...r.addedNodes)
        continue
      }
      const el = r.target as Element
      const attrs = journal.get(el) ?? journal.set(el, new Map()).get(el)!
      if (!attrs.has(r.attributeName!)) attrs.set(r.attributeName!, r.oldValue)
    }
    recorder.disconnect()
  }
}

// Put the slides back as they were before any redraw
function undoRedraws() {
  for (const n of addedNodes.reverse()) n.parentNode?.removeChild(n)
  addedNodes.length = 0
  for (const [el, attrs] of journal) {
    for (const [name, value] of attrs) {
      if (value === null) el.removeAttribute(name)
      else el.setAttribute(name, value)
    }
  }
  journal.clear()
}

function redrawEffects(root: Element | Document) {
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

// `slidev export` waits for .slidev-slide-loading to be removed before it
// captures: in the page, or with --per-slide inside the slide's
// [data-slidev-no] element. Hold the capture until the slides have settled and
// been redrawn (at most HOLD_MS: a font that never loads must not stall it).
// It looks once, right after the page loads, before this code runs: the
// theme's index.html puts the first hold in the page for that.
const holds = new Set<HTMLElement>()
let holding = false
const pageHold = () => document.getElementById('theme-export-hold')
function addHold(parent: Element) {
  const hold = document.createElement('div')
  hold.className = 'slidev-slide-loading'
  hold.style.display = 'none'
  parent.appendChild(hold)
  holds.add(hold)
}
function hold() {
  holding = true
  const first = pageHold()
  if (first) holds.add(first)
  else addHold(document.body)
  document.querySelectorAll('[data-slidev-no]').forEach(addHold)
  setTimeout(release, HOLD_MS)
}
function release() {
  holding = false
  holds.forEach(h => h.remove())
  holds.clear()
}

function start() {
  started = true
  watchEditableExport()
  hold()

  // A full pass once the slides have settled, then only what is added later
  // (e.g. another range on the browser export page)
  let pending: Set<Element> | null = null
  let timer: number | undefined
  let waiting = false // for the slides: keep holding
  const schedule = () => {
    clearTimeout(timer)
    timer = window.setTimeout(async () => {
      waiting = false
      try {
        await document.fonts.ready
        if (!isPrintMode() || !canRedraw()) return
        if (pending === null && !slidesLoaded()) {
          waiting = true
          schedule() // still compiling (Slidev shows nothing, then its own loading)
          return
        }
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
        if (!waiting) release()
      }
    }, 300)
  }
  new MutationObserver((mutations) => {
    let added = false
    for (const m of mutations) {
      m.addedNodes.forEach((n) => {
        if (!(n instanceof Element) || n.matches(OWN) || n.hasAttribute(PSEUDO) || n.matches('.slidev-slide-loading')) return
        if (holding) {
          if (n.matches('[data-slidev-no]')) addHold(n)
          n.querySelectorAll('[data-slidev-no]').forEach(addHold)
        }
        pending?.add(n)
        added = true
      })
    }
    if (added) schedule()
  }).observe(document.body, { childList: true, subtree: true })
  schedule()

  // `slidev export --dark` switches the color scheme after the page has
  // loaded, possibly after a pass: the redraws then hold light-mode colors
  // (shadows, gradients). Undo them and run a full pass again.
  let dark = document.documentElement.classList.contains('dark')
  new MutationObserver(() => {
    const now = document.documentElement.classList.contains('dark')
    if (now === dark) return
    dark = now
    if (pending === null) return // no pass yet: the first one sees the new scheme
    hold()
    undoRedraws()
    pending = null
    schedule()
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
}

// The slides are on the page with their content: Slidev shows nothing for a
// slide still compiling, then its own loading placeholder
function slidesLoaded() {
  const slides = [...document.querySelectorAll('[data-slidev-no]')]
  return slides.length > 0
    && slides.every(slide => [...slide.children].some(c => !holds.has(c as HTMLElement)))
    && [...document.querySelectorAll<HTMLElement>('.slidev-slide-loading')].every(el => holds.has(el))
}

export function setupPrintExport(router?: Parameters<typeof trackPrintRoute>[0] & { afterEach: (hook: () => void) => unknown }) {
  if (router) trackPrintRoute(router)
  const sync = () => {
    const on = isPrintMode()
    document.documentElement.classList.toggle('print-mode', on)
    if (on && !started) start()
    if (!on) pageHold()?.remove()
  }
  sync()
  router?.afterEach(() => setTimeout(sync))

  // Browser printing of the presentation itself: the CSS print rules only
  window.addEventListener('beforeprint', () => document.documentElement.classList.add('print-mode'))
  window.addEventListener('afterprint', sync)
}
