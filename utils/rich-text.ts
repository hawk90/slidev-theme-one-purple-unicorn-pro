import { shallowRef } from 'vue'

type Katex = typeof import('katex').default

// KaTeX (~260 KB, 78 KB gzip) is loaded only once a prop contains $…$, not
// for every deck that uses StoryBox / Timeline / ComplexityTable /
// PatternCard. richText reads this ref, so a component rendered before KaTeX
// arrived re-renders with the math once it has.
const katex = shallowRef<Katex | null>(null)
let loading: Promise<Katex> | undefined

export function loadKatex(): Promise<Katex> {
  loading ??= import('katex').then(m => (katex.value = m.default))
  return loading
}

/** Settles once KaTeX has loaded, if a prop asked for it (exports wait on this
 *  before capturing, so a PDF never shows a formula as plain text) */
export const katexSettled = (): Promise<unknown> => loading ?? Promise.resolve()

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Plain text with "x^y" exponents rendered as superscripts
const plain = (s: string) => escapeHtml(s).replace(/\^(\w+)/g, '<sup>$1</sup>')

// Render component prop text: $...$ as KaTeX math, the rest as escaped text
// (so props get the same math as Markdown, which does not reach inside props)
// Write \$ for a literal dollar sign.
const DOLLAR = '\u0000'

export function richText(text: unknown): string {
  const parts = String(text ?? '')
    .replace(/\\\$/g, DOLLAR)
    .split(/(\$[^$]+\$)/)
  const isMath = (part: string) => part.length > 2 && part.startsWith('$') && part.endsWith('$')
  const k = katex.value
  if (!k && parts.some(isMath)) void loadKatex()
  return parts
    .map(part =>
      !isMath(part)
        ? plain(part)
        // Until KaTeX arrives (a moment, once per deck): the formula as text
        : k ? k.renderToString(part.slice(1, -1), { throwOnError: false }) : plain(part.slice(1, -1)),
    )
    .join('')
    .replaceAll(DOLLAR, '$')
}
