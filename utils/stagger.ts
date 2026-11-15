// .stagger (styles/animations.css) stops at the first click: once the
// current slide has a click, its page gets `stagger-done` and the items not
// in yet show at once. Leaving the slide clears it, so the stagger plays
// again on the next visit. Started by global-bottom.vue (not in exports).

import type { Ref } from 'vue'
import { watch } from 'vue'
import { SLIDESHOW_ID, slideSelector } from './slidev-dom'

export const STAGGER_DONE = 'stagger-done'

export function watchStaggerClicks(currentPage: Ref<number>, clicks: Ref<number>): () => void {
  const slideshow = document.getElementById(SLIDESHOW_ID)
  if (!slideshow) return () => {}
  const stopPage = watch(currentPage, () => {
    for (const el of slideshow.querySelectorAll(`.${STAGGER_DONE}`)) el.classList.remove(STAGGER_DONE)
  })
  const stopClicks = watch(clicks, (n) => {
    if (n > 0) slideshow.querySelector(`:scope > ${slideSelector(currentPage.value)}`)?.classList.add(STAGGER_DONE)
  })
  return () => { stopPage(); stopClicks() }
}
