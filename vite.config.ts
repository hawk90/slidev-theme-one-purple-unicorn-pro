// The theme's Vite config, merged into the deck's by Slidev: `slidev build`
// writes the deck's llms.txt and handout.html next to it (utils/handout.ts),
// from the slides the preparser collected (setup/preparser.ts).
// `handout: false` in the headmatter turns it off.

import { createRequire } from 'node:module'
import path from 'node:path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import { deckText, handoutHtml } from './utils/handout'
import type { DeckSlide } from './utils/handout'

function handout(): Plugin {
  let root = process.cwd()
  let base = '/'
  return {
    name: 'one-purple-unicorn:handout',
    apply: 'build',
    configResolved(config) {
      root = config.root
      base = config.base
    },
    async generateBundle() {
      const deck = (globalThis as any).__onePurpleUnicornDeck as { slides: DeckSlide[], headmatter: Record<string, any> } | undefined
      if (!deck?.slides.length) return
      const hm = deck.headmatter ?? {}
      if (hm.handout === false || hm.handout === 'false') return
      const info = {
        title: String(hm.title ?? deck.slides[0]?.title ?? 'Slides'),
        author: typeof hm.author === 'string' ? hm.author : undefined,
        event: typeof hm.event === 'string' ? hm.event : undefined,
        date: hm.date ? String(hm.date) : undefined,
        url: typeof hm.seoMeta?.ogUrl === 'string' ? hm.seoMeta.ogUrl : undefined,
      }
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: deckText(deck.slides, info) })
      // the deck's own markdown-it (Slidev's dependency)
      try {
        const require = createRequire(path.join(root, 'package.json'))
        const MarkdownIt = (await import(require.resolve('markdown-it'))).default
        const md = new MarkdownIt({ html: false, linkify: true })
        this.emitFile({ type: 'asset', fileName: 'handout.html', source: handoutHtml(deck.slides, info, s => md.render(s), base) })
      }
      catch (e) {
        this.warn(`[theme] handout.html skipped: markdown-it not found (${(e as Error).message})`)
      }
    },
  }
}

export default defineConfig({
  plugins: [handout()],
})
