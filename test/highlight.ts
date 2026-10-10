// Shiki with the theme and both transformers, in setup/shiki.ts's order
import { readFileSync } from 'node:fs'
import { createHighlighter } from 'shiki'
import { cudaTransformer, quietColors } from '../setup/cuda-transformer.ts'
import { terminalTransformer } from '../setup/terminal-transformer.ts'

const theme = JSON.parse(readFileSync(new URL('../setup/themes/one-purple-unicorn.json', import.meta.url), 'utf8'))

const highlighter = await createHighlighter({ themes: [theme], langs: ['bash', 'zsh', 'console', 'cpp', 'python', 'ts'] })

type Hast = any

export function hast(code: string, lang: string): Hast {
  return highlighter.codeToHast(code, {
    lang,
    theme: theme.name,
    tokenizeTimeLimit: 0,
    transformers: [cudaTransformer({ quiet: quietColors(theme) }), terminalTransformer()],
  })
}

const textOf = (n: Hast): string => n.type === 'text' ? n.value : (n.children ?? []).map(textOf).join('')

function lineNodes(code: string, lang: string): Hast[] {
  const pre = hast(code, lang).children[0]
  const codeEl = pre.children.find((c: Hast) => c.tagName === 'code')
  return codeEl.children.filter((c: Hast) => c.type === 'element')
}

/** Each line as 'cmd' | 'out' (has line-output) with its text */
export function shellLines(code: string, lang = 'bash') {
  return lineNodes(code, lang).map((l) => {
    const cls = [l.properties?.class ?? l.properties?.className ?? []].flat().join(' ')
    return `${cls.includes('line-output') ? 'out' : 'cmd'} ${textOf(l)}`
  })
}

/** Text runs whose nearest span has `style`, as [text, style] */
export function styledRuns(code: string, lang: string) {
  const out: [string, string][] = []
  const walk = (n: Hast, style: string) => {
    if (n.type === 'text') { if (n.value) out.push([n.value, style]); return }
    const own = n.tagName === 'span' && n.properties?.style ? String(n.properties.style) : style
    for (const c of n.children ?? []) walk(c, own)
  }
  for (const l of lineNodes(code, lang)) walk(l, '')
  return out
}
