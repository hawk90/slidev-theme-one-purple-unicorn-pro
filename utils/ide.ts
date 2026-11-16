// IDE-chrome deck mode (`ide: true` in the headmatter; components/internal/
// IdeChrome.vue): each slide is a file tab, the tab strip navigates, and a
// status bar shows the repository, the branch and the page. Pure, so tested.

/** A slide's file name: its own `file:`, else its title as a slug, `.md` */
export function ideFileName(title: string | undefined, no: number, own?: unknown): string {
  if (typeof own === 'string' && own.trim()) return own.trim()
  const slug = String(title ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 28)
    .replace(/-+$/, '')
  return `${slug || `slide-${no}`}.md`
}

/**
 * The tabs open around slide `current`: at most `size`, within its section
 * (`starts`: the sections' first slides, ascending) when there are sections,
 * the current one kept as central as the section allows
 */
export function tabWindow(current: number, total: number, size = 6, starts: number[] = []): number[] {
  let from = 1
  let to = total
  for (const s of starts) {
    if (s <= current) from = s
    else { to = s - 1; break }
  }
  const n = Math.min(size, to - from + 1)
  let first = Math.max(from, current - Math.floor((n - 1) / 2))
  first = Math.min(first, to - n + 1)
  return Array.from({ length: n }, (_, i) => first + i)
}

export interface IdeOptions { repo: string, branch: string, language: string }

/** `ide: true` or `{ repo, branch, language }`; null when off */
export function ideOptions(value: unknown, fallbackRepo = ''): IdeOptions | null {
  if (!value || value === 'false') return null
  const o = typeof value === 'object' ? value as Record<string, unknown> : {}
  return {
    repo: String(o.repo ?? fallbackRepo ?? ''),
    branch: String(o.branch ?? 'main'),
    language: String(o.language ?? 'Markdown'),
  }
}
