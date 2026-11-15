// Entrances start once a slide has arrived, not while it is still sliding in.
// Slidev mounts slides ahead of time and plays its slide transition with
// `*-enter-from` / `*-enter-active` classes on the `.slidev-page` element.
// While those are on, the page gets `slide-arriving` (CSS holds the entrance
// classes at their start); when they go, the class goes too, so the entrances
// start over, and the page fires a `slide-arrived` event.
// A slide shown without a transition (the first one, `transition: none`)
// never gets the class and plays as before.
//
// Started by global-bottom.vue, which Slidev mounts next to #slideshow in the
// presentation and the presenter: it watches that element's pages only, and
// starts again when a route change mounts a new one, so print mode is decided
// per mount (exports play no transitions and skip it).

import { ENTERING_CLASS as ENTERING, PAGE_CLASS, SLIDESHOW_ID } from './slidev-dom'

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

export function watchSlideArrival(): () => void {
  const slideshow = document.getElementById(SLIDESHOW_ID)
  if (!slideshow) return () => {}
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      const el = m.target as Element
      // The pages are #slideshow's children; class changes inside them are not ours
      if (el.parentElement === slideshow && el.classList.contains(PAGE_CLASS)) update(el)
    }
  })
  observer.observe(slideshow, { attributes: true, attributeFilter: ['class'], subtree: true })
  return () => observer.disconnect()
}
