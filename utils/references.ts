// Numbered references across a deck, at build time (setup/preparser.ts):
//
//   [@knuth1974]            a citation from the bibliography → [1]
//   \label{eq:roofline}     inside display math → \tag{1}; [@eq:roofline] → (1)
//   {#thm:amdahl}           anywhere → "1"; [@thm:amdahl] → Theorem 1
//   {#fig:…} {#tab:…}       the same, Figure / Table
//   <References />          the cited entries, in order of first citation
//
// Numbered in the order they appear in the deck file, not with CSS counters
// (which skip hidden slides and restart per slide). Pure, so it is tested.

import type { BibEntry } from './bibtex.ts'
import { formatEntry, shortEntry } from './bibtex.ts'

const NAMES: Record<string, string> = { thm: 'Theorem', lem: 'Lemma', def: 'Definition', fig: 'Figure', tab: 'Table', sec: 'Section', alg: 'Algorithm' }

export interface Numbered { cites: string[], labels: Map<string, number> }

const LABEL = /\\label\{((\w+):[\w.-]+)\}|\{#((\w+):[\w.-]+)\}/g
const CITE = /\[@([\w.:-]+(?:\s*;\s*@[\w.:-]+)*)\]/g

/** First pass: the order of citations and the number of each label */
export function collect(lines: string[], isBib: (key: string) => boolean): Numbered {
  const cites: string[] = []
  const labels = new Map<string, number>()
  const counters = new Map<string, number>()
  forEachText(lines, (text) => {
    for (const m of text.matchAll(LABEL)) {
      const id = m[1] ?? m[3]
      const kind = m[2] ?? m[4]
      if (labels.has(id)) continue
      const n = (counters.get(kind) ?? 0) + 1
      counters.set(kind, n)
      labels.set(id, n)
    }
    for (const m of text.matchAll(CITE)) {
      for (const key of m[1].split(/\s*;\s*@?/).map(k => k.replace(/^@/, ''))) {
        if (isBib(key) && !cites.includes(key)) cites.push(key)
      }
    }
  })
  return { cites, labels }
}

/** Calls fn on each line outside fenced code (and not inside inline code) */
function forEachText(lines: string[], fn: (text: string, i: number) => void) {
  let fence = ''
  lines.forEach((line, i) => {
    const open = /^\s*(`{3,}|~{3,})/.exec(line)?.[1]
    if (open && (!fence || open.startsWith(fence))) { fence = fence ? '' : open; return }
    if (!fence) fn(line.replace(/`[^`]*`/g, m => ' '.repeat(m.length)), i)
  })
}

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Second pass: rewrite the lines (outside code) with the numbers */
export function apply(lines: string[], numbered: Numbered, bib: Map<string, BibEntry>, warn: (msg: string) => void = () => {}) {
  const { cites, labels } = numbered
  let fence = ''
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const open = /^\s*(`{3,}|~{3,})/.exec(line)?.[1]
    if (open && (!fence || open.startsWith(fence))) { fence = fence ? '' : open; continue }
    if (fence) continue

    const refs = /^\s*<References\b([^>]*)\/?>\s*$/.exec(line)
    if (refs) {
      const attrs = refs[1]
      const all = /\ball\b/.test(attrs)
      const from = Number(/\bfrom="?(\d+)/.exec(attrs)?.[1] ?? 1)
      const to = Number(/\bto="?(\d+)/.exec(attrs)?.[1] ?? Infinity)
      const keys = all ? [...cites, ...[...bib.keys()].filter(k => !cites.includes(k))] : cites
      const items = keys.map((k, j) => ({ n: j + 1, e: bib.get(k) })).filter(x => x.e && x.n >= from && x.n <= to)
      lines.splice(i, 1, `<ol class="references" start="${from}">`, ...items.map(x => `<li id="ref-${escapeAttr(x.e!.key)}">\n\n${formatEntry(x.e!)}\n\n</li>`), '</ol>')
      i += items.length + 1
      continue
    }

    // keep inline code as it is: work on the parts between backticks
    lines[i] = line.split(/(`[^`]*`)/).map((part, j) => j % 2 ? part : part
      .replace(LABEL, (_, eqId, _k, id) => {
        if (eqId) return `\\tag{${labels.get(eqId)}}`
        return String(labels.get(id) ?? '?')
      })
      .replace(CITE, (whole, body: string) => {
        const keys = body.split(/\s*;\s*@?/).map(k => k.replace(/^@/, ''))
        const parts = keys.map((key) => {
          const label = labels.get(key)
          if (label !== undefined) {
            const kind = key.split(':')[0]
            return kind === 'eq' ? `(${label})` : `${NAMES[kind] ?? kind} ${label}`
          }
          const n = cites.indexOf(key) + 1
          if (!n) { warn(`no bibliography entry or label "${key}"`); return `?${key}` }
          const e = bib.get(key)!
          return `<a class="cite" href="#ref-${escapeAttr(key)}" title="${escapeAttr(shortEntry(e))}">${n}</a>`
        })
        // citations together in one bracket: [1, 3]; labels as words
        const isCite = (p: string) => p.startsWith('<a class="cite"')
        return parts.every(isCite) ? `<span class="cite-group">[${parts.join(', ')}]</span>` : parts.join(', ')
      }),
    ).join('')
  }
}
