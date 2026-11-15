// Kiosk auto-advance (`autoAdvance: 8s` in the headmatter, a slide's own
// `autoAdvance` overrides it): the deck steps itself (clicks, then slides),
// pauses while someone uses it, and can loop. Started from global-bottom.vue
// in the play view only: not in exports, nor in the presenter view (whose
// steps reach the audience view anyway, so both would advance).

import type { Ref } from 'vue'
import { watch } from 'vue'
import { isOff } from './frontmatter.ts'
import { durationSeconds } from './pace.ts'

/** Milliseconds to wait on this slide, or null for none: the slide's own
 *  `autoAdvance` (false stops on it) else the deck's. A bare number is
 *  seconds; "8s", "1m", "0:30" work as for `duration`. */
export function advanceDelay(own: unknown, deck: unknown): number | null {
  const value = own ?? deck
  if (value === undefined || value === null || isOff(value) || value === '') return null
  const seconds = durationSeconds(value)
  return seconds ? Math.max(500, seconds * 1000) : null
}

export interface AutoAdvanceNav {
  currentPage: Ref<number>
  clicks: Ref<number>
  hasNext: Ref<boolean>
  next: () => unknown
  go: (page: number) => unknown
}

/**
 * Runs the timer. `delayFor()` reads the current slide's delay; `loop` goes
 * back to the first slide after the last step; input (keys, pointer, wheel,
 * touch) pauses it for `idleMs`, then it starts counting again.
 */
export function startAutoAdvance(nav: AutoAdvanceNav, delayFor: () => number | null, loop: boolean, idleMs: number) {
  let timer: ReturnType<typeof setTimeout> | undefined
  let pausedUntil = 0

  const schedule = () => {
    clearTimeout(timer)
    const delay = delayFor()
    if (delay === null) return
    const wait = Math.max(delay, pausedUntil - Date.now())
    timer = setTimeout(step, wait)
  }
  const step = () => {
    if (Date.now() < pausedUntil) return schedule()
    if (nav.hasNext.value) nav.next()
    else if (loop) nav.go(1)
    // navigation re-schedules through the watch below; a last step that
    // stays put (no loop) leaves the timer off
  }
  const onInput = () => {
    pausedUntil = Date.now() + idleMs
    schedule()
  }

  const stop = watch([nav.currentPage, nav.clicks], schedule, { immediate: true })
  const events = ['keydown', 'pointerdown', 'wheel', 'touchstart'] as const
  for (const e of events) window.addEventListener(e, onInput, { passive: true, capture: true })
  return () => {
    stop()
    clearTimeout(timer)
    for (const e of events) window.removeEventListener(e, onInput, { capture: true })
  }
}
