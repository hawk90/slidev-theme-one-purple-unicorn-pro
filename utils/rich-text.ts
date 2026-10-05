import katex from 'katex'

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Plain text with "x^y" exponents rendered as superscripts
const plain = (s: string) => escapeHtml(s).replace(/\^(\w+)/g, '<sup>$1</sup>')

// Render component prop text: $...$ as KaTeX math, the rest as escaped text
// (so props get the same math as Markdown, which does not reach inside props)
export function richText(text: unknown): string {
  return String(text ?? '')
    .split(/(\$[^$]+\$)/)
    .map(part =>
      part.length > 2 && part.startsWith('$') && part.endsWith('$')
        ? katex.renderToString(part.slice(1, -1), { throwOnError: false })
        : plain(part),
    )
    .join('')
}
