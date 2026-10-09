// Shell sessions in code blocks: in a bash/sh/zsh/console… block with at
// least one prompt line (`$ cmd`, `❯ cmd`…), the other lines are output and get the
// `line-output` class (muted, styles/code-theme.css), instead of being
// highlighted as commands.
//
//   ```bash [zsh]
//   $ ./kernel
//   Result: 42
//   ```

import type { ShikiTransformer } from 'shiki'

type Element = Parameters<NonNullable<ShikiTransformer['span']>>[0]
type Node = Element | Element['children'][number]

const SHELLS = new Set(['bash', 'sh', 'shell', 'shellscript', 'zsh', 'fish', 'console', 'shellsession'])
// `$ cmd`, zsh's `% cmd`, or a themed prompt ending in ❯ / ➜ (starship,
// powerlevel10k, oh-my-zsh: `~/app  main ❯ cmd`). A prompt starts at the
// line's start: indented `  ➜  Local: …` (Vite) or ` ❯ a.test.ts` (Vitest)
// is output. Not recognized: root `#` (a comment), `>>>`, `PS C:\>`.
const PROMPT = /^[$%❯➜](\s|$)|^\S.*\s[❯➜](\s|$)/

const textOf = (node: Node): string =>
  node.type === 'text' ? node.value : 'children' in node ? node.children.map(textOf).join('') : ''

export function terminalTransformer(): ShikiTransformer {
  return {
    name: 'terminal-output',
    pre(node) {
      if (!SHELLS.has(this.options.lang)) return
      const code = node.children.find((c): c is Element => c.type === 'element' && c.tagName === 'code')
      if (!code) return
      const lines = code.children.filter((c): c is Element => c.type === 'element')
      const texts = lines.map(textOf)
      if (!texts.some(t => PROMPT.test(t))) return
      // A command ending in `\` goes on in the next line (still the command)
      let command = false
      lines.forEach((line, i) => {
        const text = texts[i]
        command = PROMPT.test(text) || (command && texts[i - 1].endsWith('\\'))
        if (!command && text.trim()) this.addClassToHast(line, 'line-output')
      })
    },
  }
}
