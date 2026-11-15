// ```prose and ```quote fences: text, not code. They step through their lines
// with Slidev's line-highlight clicks (```quote {1|2-3}), the lines not lit
// dimmed as in code, but in the slide's own type (styles/code-theme.css). A
// fence in an unknown language fails the whole slide, so both names are
// registered: a grammar with no rules, nothing colored.
import type { ShikiTransformer } from 'shiki'

export const PROSE_LANGS = new Set(['prose', 'quote'])

const prose = { name: 'prose', scopeName: 'text.prose', patterns: [] }
const quote = { name: 'quote', scopeName: 'text.quote', patterns: [] }

/** For setup/shiki.ts `langs` (Slidev's record form) */
export const proseLangs = { prose: async () => [prose], quote: async () => [quote] }

/** Marks the block (class slidev-prose, and slidev-prose-quote for ```quote) */
export function proseTransformer(): ShikiTransformer {
  return {
    name: 'one-purple-unicorn:prose',
    pre(node) {
      const lang = this.options.lang
      if (!PROSE_LANGS.has(lang)) return
      this.addClassToHast(node, lang === 'quote' ? ['slidev-prose', 'slidev-prose-quote'] : 'slidev-prose')
    },
  }
}
