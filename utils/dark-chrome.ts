// The chrome (progress bar, footer, page number, stage indicator) follows the
// current slide: over a dark layout (`slide-dark`) it takes the dark palette
// in light mode too (styles/colors.css, `#slide-content.chrome-dark`).
//
// This used to be a `:has()` on the visible page's `style` attribute, which
// Slidev's v-show rewrites on every navigation: Chrome re-ran it in each style
// recalc, an ~85 ms long task entering dark layouts. Here it is one query per
// navigation, or when the slides' DOM changes (a slide compiled on first
// visit). It reads the DOM, not a layout list, so a deck's own layouts with
// `slide-dark` count too. Exports keep the :has() branch (one container per
// slide, nothing changes there).

import type { Ref } from 'vue'
import { nextTick, watch } from 'vue'
import { LAYOUT_CLASS, SLIDE_CONTENT_ID, SLIDESHOW_ID, slideSelector } from './slidev-dom'

export function watchDarkChrome(currentPage: Ref<number>) {
  const content = document.getElementById(SLIDE_CONTENT_ID)
  const slideshow = content?.querySelector(`:scope > #${SLIDESHOW_ID}`)
  if (!content || !slideshow) return () => {}

  let frame = 0
  const update = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      const layout = slideshow.querySelector(`:scope > ${slideSelector(currentPage.value)} .${LAYOUT_CLASS}`)
      content.classList.toggle('chrome-dark', !!layout?.classList.contains('slide-dark'))
    })
  }

  const stop = watch(currentPage, () => nextTick(update), { immediate: true })
  const observer = new MutationObserver(update)
  observer.observe(slideshow, { childList: true, subtree: true })
  return () => {
    stop()
    observer.disconnect()
    cancelAnimationFrame(frame)
    content.classList.remove('chrome-dark')
  }
}
