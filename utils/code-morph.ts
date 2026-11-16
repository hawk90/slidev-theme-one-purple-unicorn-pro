// Code windows that morph between consecutive slides: with Slidev's
// `transition: view-transition`, the browser matches elements by
// view-transition-name across the change. Each slide's code windows get
// `code-window-1`, `-2`… in order, so the first window of one slide grows,
// shrinks or moves into the first of the next, its text crossfading; the
// rest of the slide crossfades as usual. Hidden slides (display: none) take
// no part, so the same names on every slide don't clash. Timed by Slidev's
// magicMoveDuration (800 ms), as its in-slide magic move.
//
// Started by global-bottom.vue when a slide (or the deck) uses
// view-transition; not in exports.

import { SLIDESHOW_ID } from './slidev-dom'

/** The code windows of a slide: blocks, code groups, <ClickTabs>; not a block
 *  inside one of those (a group's or a tab's pane) */
export const WINDOW = '.slidev-code-wrapper, .slidev-code-group, .click-tabs'

export function nameCodeWindows(page: Element) {
  const windows = [...page.querySelectorAll<HTMLElement>(WINDOW)]
    .filter(w => !w.parentElement?.closest('.slidev-code-group, .click-tabs') && !w.querySelector(':scope > pre.slidev-prose'))
  // A data attribute, not an inline style: Vue rewrites the style of the
  // blocks it renders (maxHeight), which dropped the name. The CSS turns it
  // into view-transition-name (styles/animations.css, the first 8)
  windows.forEach((w, i) => {
    const n = String(i + 1)
    if (w.dataset.codeWindow !== n) w.dataset.codeWindow = n
  })
}

export function watchCodeMorph(durationMs: number): () => void {
  document.documentElement.style.setProperty('--code-morph-duration', `${durationMs}ms`)
  // #slideshow can be replaced after this starts (loading on another slide
  // than the first): watch the body and find the pages each time
  let frame = 0
  const update = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => document.querySelectorAll(`#${SLIDESHOW_ID} > .slidev-page`).forEach(nameCodeWindows))
  }
  update()
  const observer = new MutationObserver(update)
  observer.observe(document.body, { childList: true, subtree: true })
  return () => { observer.disconnect(); cancelAnimationFrame(frame) }
}
