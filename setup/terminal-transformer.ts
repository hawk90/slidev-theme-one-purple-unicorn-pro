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
// is output. A block whose first prompt is `$ ` or `% ` has only those, so
// output such as `built ❯ done` there is output. Not recognized: root `#`
// (a comment), `>>>`, `PS C:\>`.
const PLAIN = /^[$%❯➜](\s|$)/
const THEMED = /^[$%❯➜](\s|$)|^\S.*\s[❯➜](\s|$)/
// A command goes on in the next line after a trailing `\`, `|`, `&&`, `||`,
// or inside `for … do … done`, `if … fi`, `case … esac`, `{ … }` and
// heredocs (`<<EOF` … `EOF`, not a `<<<` here-string or `$((a << b))`), and
// in an open quote; the shell shows `> ` there (PS2)
const CONTINUES = /(\\|\||&&|\|\||\{|\()\s*$/
// Keywords where a command starts (not in `git log --grep=for`), after
// quoted strings and comments are dropped
const OPENS = /(?:^|[;&|(]|\b(?:do|then|else))\s*(?:if|for|while|until|case)\b|\{$/g
const CLOSES = /(?:^|[;&|])\s*(?:fi|done|esac|\})(?=[\s;&|)]|$)/g
const bare = (body: string) => body.replace(/(["'])(?:\\.|(?!\1)[^\\])*\1/g, 's').replace(/(^|\s)#.*$/, '').trim()
const HEREDOC = /(?<!<)<<-?\s*(['"]?)([A-Za-z_]\w*)\1/

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
      const first = texts.find(t => THEMED.test(t))
      if (first === undefined) return
      const PROMPT = /^[$%](\s|$)/.test(first) ? PLAIN : THEMED
      let command = false
      let depth = 0 // open for/if/case/{ blocks
      let heredoc = '' // the end word while in a heredoc
      let open = false // the last command line goes on
      let quote = '' // the quote left open at the end of the last line
      lines.forEach((line, i) => {
        const text = texts[i]
        if (heredoc) {
          // heredoc input, then its end word: part of the command
          if (text.replace(/^>\s?/, '').trim() === heredoc) heredoc = ''
          command = true
        }
        else if (PROMPT.test(text) || (command && (open || depth > 0 || quote))) {
          const prompt = text.match(PROMPT)
          if (prompt) {
            depth = 0
            quote = ''
          }
          let raw = prompt ? text.slice(prompt[0].length) : text.replace(/^>\s?/, '')
          if (quote) {
            // the rest of a quoted string: up to its closing quote
            const end = raw.indexOf(quote)
            command = true
            if (end < 0) return
            raw = raw.slice(end + 1)
            quote = ''
          }
          let body = bare(raw)
          const left = body.search(/["']/) // a quote that doesn't close on this line
          if (left >= 0) {
            quote = body[left]
            body = body.slice(0, left)
          }
          depth = Math.max(0, depth + (body.match(OPENS)?.length ?? 0) - (body.match(CLOSES)?.length ?? 0))
          heredoc = raw.replace(/\$\(\([^)]*\)\)/g, '').match(HEREDOC)?.[2] ?? ''
          open = CONTINUES.test(body)
          command = true
        }
        else {
          command = false
        }
        if (!command && text.trim()) this.addClassToHast(line, 'line-output')
      })
    },
  }
}
