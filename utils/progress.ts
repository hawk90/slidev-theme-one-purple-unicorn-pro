// The progress bar's options (global-bottom.vue), pure so they are tested.

import { isOff } from './frontmatter.ts'

/**
 * progressBar (a slide's own, else the deck's):
 *   "always" (default) → every slide
 *   "content"          → only where the page number shows (not cover, section, intro, end)
 *   false              → off
 */
export function progressMode(value: unknown): 'always' | 'content' | 'off' {
  if (isOff(value)) return 'off'
  return value === 'content' ? 'content' : 'always'
}

/**
 * How far along the deck page `page` of `total` is, in percent (0 on the
 * first, 100 on the last). With `exclude`, the `skipped` pages
 * (progressBarSkip) are left out of the count, so the bar doesn't move there.
 */
export function progressPercent(page: number, total: number, skipped: Iterable<number> = [], exclude = false) {
  let p = page
  let count = total
  if (exclude) {
    const s = [...skipped]
    p -= s.filter(n => n < page).length
    count -= s.length
  }
  return count > 1 ? ((p - 1) / (count - 1)) * 100 : 0
}
