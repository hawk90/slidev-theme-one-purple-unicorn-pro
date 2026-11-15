// Parse a page list like "1, 5, 10-12" or [1, 5, "10-12"] into a set of page numbers.
// Pages are 1-based; anything below 1 or above `max` (the deck's page count) is ignored.
export function parsePageList(value: unknown, max = Number.POSITIVE_INFINITY): Set<number> {
  const pages = new Set<number>()
  const items = Array.isArray(value) ? value : String(value ?? '').split(',')
  for (const item of items) {
    const [start, end = start] = String(item).split(/[-–]/).map(s => Number.parseInt(s.trim(), 10))
    if (Number.isNaN(start) || Number.isNaN(end)) continue
    const last = Math.min(Math.max(start, end), max)
    for (let n = Math.max(Math.min(start, end), 1); n <= last; n++) pages.add(n)
  }
  return pages
}

// Page numbers (global-bottom.vue): what each page shows, from every slide's
// frontmatter. Pure, so it is tested (test/pages.test.ts).
//   pageNumber: skip  → no number, and the slide isn't counted
//   pageNumber: hold  → shows the last counted number, isn't counted itself
//   appendix: true    → from this slide on, pages are A1, A2… and the total
//                       stays the count before it
type Frontmatter = Record<string, unknown>

export interface PageLabel {
  /** '' on a skipped page */
  label: string
  appendix: boolean
}

export function pageLabels(frontmatters: Frontmatter[]): { labels: PageLabel[], total: number } {
  const labels: PageLabel[] = []
  let count = 0
  let inAppendix = false
  let total: number | undefined
  for (const fm of frontmatters) {
    if (!inAppendix && (fm.appendix === true || fm.appendix === 'true')) {
      inAppendix = true
      total = count
      count = 0
    }
    const mode = fm.pageNumber
    if (mode === 'skip') {
      labels.push({ label: '', appendix: inAppendix })
      continue
    }
    if (mode !== 'hold') count++
    const n = Math.max(count, 1)
    labels.push({ label: inAppendix ? `A${n}` : String(n), appendix: inAppendix })
  }
  return { labels, total: total ?? count }
}

export const PAGE_FORMATS = ['c/t', 'c', 'c of t'] as const
export type PageFormat = typeof PAGE_FORMATS[number]

/**
 * The text of the page number: `pageNumberFormat` "c/t" (default, "3 / 12"),
 * "c" ("3") or "c of t" ("3 of 12"). Appendix pages show their label alone
 * ("A2"): the total counts the main part only.
 */
export function formatPageNumber(page: PageLabel, total: number, format: unknown = 'c/t'): string {
  if (!page.label) return ''
  if (page.appendix || format === 'c') return page.label
  return format === 'c of t' ? `${page.label} of ${total}` : `${page.label} / ${total}`
}
