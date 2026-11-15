// `slidev export` waits for .slidev-slide-loading to be removed before it
// captures: in the page, or with --per-slide inside the slide's
// [data-slidev-no] element. The redraws (print-export.ts) hold the capture
// until the slides have settled and been redrawn, at most HOLD_MS: a font that
// never loads must not stall it.
// It looks once, right after the page loads, before the theme's code runs:
// the theme's index.html puts the first hold in the page for that, with a
// 20 s timer of its own in case this code never runs (keep HOLD_MS under it).

import { LOADING_CLASS, SLIDE_NO_ATTR } from './slidev-dom'

const HOLD_MS = 15000
const PAGE_HOLD_ID = 'theme-export-hold'

const holds = new Set<HTMLElement>()
let holding = false

/** Outside an export: let go of index.html's hold at once */
export const removePageHold = () => document.getElementById(PAGE_HOLD_ID)?.remove()

/** Holding: a slide added now gets its own hold (addHold) */
export const isHolding = () => holding

export function addHold(parent: Element) {
  const hold = document.createElement('div')
  hold.className = LOADING_CLASS
  hold.style.display = 'none'
  parent.appendChild(hold)
  holds.add(hold)
}

/** Hold the page and every slide on it, until release() or HOLD_MS */
export function hold() {
  holding = true
  const first = document.getElementById(PAGE_HOLD_ID)
  if (first) holds.add(first)
  else addHold(document.body)
  document.querySelectorAll(`[${SLIDE_NO_ATTR}]`).forEach(addHold)
  setTimeout(release, HOLD_MS)
}

export function release() {
  holding = false
  holds.forEach(h => h.remove())
  holds.clear()
}

/** The slides are on the page with their content: Slidev shows nothing for a
 *  slide still compiling, then its own loading placeholder (not our holds) */
export function slidesLoaded() {
  const slides = [...document.querySelectorAll(`[${SLIDE_NO_ATTR}]`)]
  return slides.length > 0
    && slides.every(slide => [...slide.children].some(c => !holds.has(c as HTMLElement)))
    && [...document.querySelectorAll<HTMLElement>(`.${LOADING_CLASS}`)].every(el => holds.has(el))
}
