// Parse a page list like "1, 5, 10-12" or [1, 5, "10-12"] into a set of page numbers
export function parsePageList(value: unknown): Set<number> {
  const pages = new Set<number>()
  const items = Array.isArray(value) ? value : String(value ?? '').split(',')
  for (const item of items) {
    const [start, end = start] = String(item).split('-').map(s => Number.parseInt(s.trim(), 10))
    if (Number.isNaN(start) || Number.isNaN(end)) continue
    for (let n = Math.min(start, end); n <= Math.max(start, end); n++) pages.add(n)
  }
  return pages
}
