// When a component's own motion plays (#57 A): each time its slide is shown,
// once the slide transition is over (utils/slide-arrival.ts), so it is seen
// from the start; again on every revisit. In exports and with reduced motion
// it never plays: the component stays at its final state.
// (CSS entrances do the same with classes: .slide-arriving in animations.css.)

import type { Ref } from 'vue'
import { onMounted } from 'vue'
import { onSlideEnter } from '@slidev/client'
import { isPrintMode } from './print-mode'
import { PAGE_CLASS } from './slidev-dom'

/**
 * `reset()` puts the motion at its start when the slide is entered, `play()`
 * runs it when the slide has arrived. Outside a slide it plays on mount.
 */
export function onSlideArrival(el: Ref<HTMLElement | null | undefined>, reset: () => void, play: () => void) {
  const still = () => isPrintMode()
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const enter = () => {
    if (still()) return
    reset()
    // The transition classes come with the same navigation: look a frame later
    requestAnimationFrame(() => {
      const page = el.value?.closest(`.${PAGE_CLASS}`)
      if (page?.classList.contains('slide-arriving')) page.addEventListener('slide-arrived', play, { once: true })
      else play()
    })
  }
  try {
    onSlideEnter(enter)
  }
  catch {
    onMounted(enter)
  }
}
