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
