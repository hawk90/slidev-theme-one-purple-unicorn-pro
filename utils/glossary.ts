// Glossary tooltips: `glossary: { term: definition }` in the headmatter (the
// deck's) or on a slide (that slide's, on top). The first time a term appears
// in a slide's text it gets a dotted underline and its definition on hover;
// code, links, headings' gradient text and math are left alone. Terms match
// whole words; a Korean term matches before a particle too (메모리가, 메모리를),
// since Hangul runs on into its 조사. Started by global-bottom.vue.

import { SLIDESHOW_ID } from './slidev-dom.ts' // .ts: node --test loads this file directly

const HANGUL = /[ㄱ-ㆎ가-힣]$/
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** A pattern for the terms, longest first (so "shared memory" wins over "memory") */
export function glossaryPattern(terms: string[]): RegExp | null {
  const list = terms.map(t => t.trim()).filter(Boolean).sort((a, b) => b.length - a.length)
  if (!list.length) return null
  const alts = list.map(t => `${escapeRe(t)}${HANGUL.test(t) ? '' : '(?![\\p{L}\\p{N}_])'}`)
  return new RegExp(`(?<![\\p{L}\\p{N}_])(?:${alts.join('|')})`, 'giu')
}

/** The terms' entries keyed by lower case (lookups are case-insensitive) */
export function glossaryEntries(...maps: unknown[]): Map<string, { term: string, text: string }> {
  const out = new Map<string, { term: string, text: string }>()
  for (const m of maps) {
    if (!m || typeof m !== 'object') continue
    for (const [term, text] of Object.entries(m as Record<string, unknown>)) {
      if (typeof text === 'string' && term.trim()) out.set(term.trim().toLowerCase(), { term: term.trim(), text })
    }
  }
  return out
}

const SKIP = 'code, pre, a, kbd, .katex, .slidev-code-wrapper, h1, abbr, svg, button, .gloss, .no-glossary'

/** Mark the first use of each term in `root` (a slide's layout) */
export function markGlossary(root: Element, entries: Map<string, { term: string, text: string }>) {
  const pattern = glossaryPattern([...entries.values()].map(e => e.term))
  if (!pattern) return
  const seen = new Set(root.querySelectorAll('.gloss').length ? [...root.querySelectorAll<HTMLElement>('.gloss')].map(g => g.dataset.term ?? '') : [])
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: n => (n.parentElement?.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  })
  const nodes: Text[] = []
  while (walker.nextNode()) nodes.push(walker.currentNode as Text)
  // a match splits its node: the text after it goes back in the queue
  for (let k = 0; k < nodes.length; k++) {
    const node = nodes[k]
    const text = node.data
    pattern.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = pattern.exec(text))) {
      const key = m[0].toLowerCase()
      const entry = entries.get(key)
      if (!entry || seen.has(key)) continue
      seen.add(key)
      const term = node.splitText(m.index)
      const rest = term.splitText(m[0].length)
      const abbr = document.createElement('abbr')
      abbr.className = 'gloss'
      abbr.dataset.def = entry.text // the tooltip (CSS), not title: no second, native one
      abbr.setAttribute('aria-description', entry.text)
      abbr.dataset.term = key
      abbr.tabIndex = 0
      term.replaceWith(abbr)
      abbr.append(term)
      nodes.push(rest)
      break
    }
  }
}

/** Mark the slides as they show; `entriesFor(no)` gives a slide's glossary */
export function watchGlossary(entriesFor: (no: number) => Map<string, { term: string, text: string }>): () => void {
  let frame = 0
  const update = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      for (const page of document.querySelectorAll<HTMLElement>(`#${SLIDESHOW_ID} > .slidev-page`)) {
        const entries = entriesFor(Number(page.dataset.slidevNo))
        const layout = page.querySelector('.slidev-layout')
        if (entries.size && layout && !layout.querySelector('.slidev-slide-loading')) markGlossary(layout, entries)
      }
    })
  }
  update()
  const observer = new MutationObserver(update)
  observer.observe(document.body, { childList: true, subtree: true })
  return () => { observer.disconnect(); cancelAnimationFrame(frame) }
}
