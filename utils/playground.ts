// An "Open in Compiler Explorer" button on code blocks (`playground: true`
// in the headmatter, or a list of languages; a slide's own `playground`
// replaces the deck's there, `false` for none). A link only, no runner: Compiler Explorer opens
// the block's code in an editor with the language set, ready to compile
// (CUDA shows PTX/SASS there). Added in the presentation by global-bottom.vue,
// not in exports.

import { SLIDESHOW_ID } from './slidev-dom.ts' // .ts: node --test loads this file directly

/** Compiler Explorer's language ids, by the fence's language */
export const PLAYGROUND_LANGS: Record<string, string> = {
  cuda: 'cuda', cu: 'cuda', cuh: 'cuda',
  cpp: 'c++', 'c++': 'c++', cc: 'c++', hpp: 'c++',
  c: 'c',
  python: 'python', py: 'python',
  rust: 'rust', rs: 'rust',
  go: 'go',
  zig: 'zig',
  swift: 'swift',
  kotlin: 'kotlin',
  java: 'java',
}

/** Which fence languages get a button: `true` all of the above, a list (or
 *  "cuda, python") those of them; null for none */
export function playgroundLangs(value: unknown): Set<string> | null {
  if (value === true || value === 'true') return new Set(Object.keys(PLAYGROUND_LANGS))
  const list = Array.isArray(value) ? value.map(String) : typeof value === 'string' && value !== 'false' ? value.split(',') : []
  const langs = list.map(s => s.trim().toLowerCase()).filter(l => l in PLAYGROUND_LANGS)
  return langs.length ? new Set(langs) : null
}

/** A Compiler Explorer link that opens `source` in `lang` (its client-state
 *  URL: the editor's state as base64 JSON) */
export function playgroundUrl(lang: string, source: string): string | null {
  const id = PLAYGROUND_LANGS[lang]
  if (!id) return null
  // compilers and executors must be there (empty: the user picks), or it answers 400
  const state = { sessions: [{ id: 1, language: id, source, compilers: [], executors: [] }] }
  const bytes = new TextEncoder().encode(JSON.stringify(state))
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return `https://godbolt.org/clientstate/${encodeURIComponent(btoa(bin))}`
}

/** The code a block shows, without what the theme adds to lines (inline
 *  diagnostics' messages and values) */
export function blockSource(code: Element): string {
  const lines = [...code.querySelectorAll('.line')]
  return lines.map((line) => {
    const clone = line.cloneNode(true) as Element
    clone.querySelectorAll('.diag-msg, .diag-value').forEach(e => e.remove())
    return clone.textContent ?? ''
  }).join('\n')
}

const BUTTON = 'code-playground'

/**
 * Add the buttons on the slides' code blocks, in the languages `langsFor(no)`
 * gives for each slide (null: none there); again when slides are compiled
 * later.
 */
export function watchPlaygrounds(langsFor: (no: number) => Set<string> | null): () => void {
  let frame = 0
  const update = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      for (const page of document.querySelectorAll<HTMLElement>(`#${SLIDESHOW_ID} > .slidev-page`)) {
        const langs = langsFor(Number(page.dataset.slidevNo))
        if (!langs) continue
        for (const code of page.querySelectorAll('pre.slidev-code > code[class*="language-"]')) {
          const wrapper = code.closest('.slidev-code-wrapper')
          if (!wrapper || wrapper.querySelector(`:scope > .${BUTTON}`)) continue
          const lang = /language-([\w+-]+)/.exec(code.className)?.[1] ?? ''
          if (!langs.has(lang)) continue
          const url = playgroundUrl(lang, blockSource(code))
          if (!url) continue
          const a = document.createElement('a')
          a.className = BUTTON
          a.href = url
          a.target = '_blank'
          a.rel = 'noopener'
          a.textContent = 'Compiler Explorer ↗'
          a.title = 'Open this code in Compiler Explorer'
          wrapper.append(a)
        }
      }
    })
  }
  update()
  const observer = new MutationObserver(update)
  observer.observe(document.body, { childList: true, subtree: true })
  return () => { observer.disconnect(); cancelAnimationFrame(frame) }
}
