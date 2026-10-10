// Entrances start once a slide has arrived, not while it is still sliding in.
// Slidev mounts slides ahead of time and plays its slide transition with
// `*-enter-from` / `*-enter-active` classes on the `.slidev-page` element.
// While those are on, the page gets `slide-arriving` (CSS holds the entrance
// classes at their start); when they go, the class goes too, so the entrances
// start over, and the page fires a `slide-arrived` event.
// A slide shown without a transition (the first one, `transition: none`)
// never gets the class and plays as before.

import { isPrintMode } from './print-mode'

const ENTERING = /-enter-(?:from|active|to)$/

function update(page: Element) {
  const entering = [...page.classList].some(c => ENTERING.test(c))
  // Only touch the class when it changes: setting it fires the observer again
  if (entering && !page.classList.contains('slide-arriving')) {
    page.classList.add('slide-arriving')
  }
  else if (!entering && page.classList.contains('slide-arriving')) {
    page.classList.remove('slide-arriving')
    page.dispatchEvent(new CustomEvent('slide-arrived'))
  }
}

export function setupSlideArrival() {
  if (typeof window === 'undefined' || isPrintMode()) return
  new MutationObserver((mutations) => {
    for (const m of mutations) {
      if ((m.target as Element).classList?.contains('slidev-page')) update(m.target as Element)
    }
  }).observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: true })
}
