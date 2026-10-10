import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { shellLines } from './highlight.ts'

// Each case: the block, then per line c (command) / o (output) / - (blank)
const marks = (code: string, lang = 'bash') =>
  shellLines(code, lang).map(l => l.startsWith('out') ? 'o' : l.slice(4).trim() ? 'c' : '-').join('')

const CASES: [name: string, code: string, expected: string, lang?: string][] = [
  ['command then output', '$ ./kernel\nResult: 42', 'co'],
  ['backslash continuation', '$ nvcc -O3 \\\n  -o saxpy saxpy.cu\ndone', 'cco'],
  ['for … do / > echo / > done', '$ for i in 1 2; do\n> echo $i\n> done\n1\n2', 'cccoo'],
  ['heredoc', "$ cat > f <<'EOF'\nhello\nfor x\nEOF\n$ cat f\nhello", 'ccccco'],
  ['npm run dev: `> pkg dev` lines are output', '$ npm run dev\n\n> example@1.0.0 dev\n> slidev\n\nready', 'c-oo-o'],
  ['keyword in a string', '$ echo "wait for it"\nwait for it', 'co'],
  ['keyword in an option', '$ git log --grep=for\ncommit abc', 'co'],
  ['one-line if/fi', '$ if true; then echo y; fi\ny', 'co'],
  ['trailing pipe', '$ cat log |\n  grep err\nerr 1', 'cco'],
  ['❯ in $ output', '$ make\nbuilt ❯ done', 'co'],
  ['starship prompt', '~/app main ❯ make\nok', 'co'],
  ['bare word prompt', 'cuda ❯ make\nok', 'co'],
  ['Nerd Font prompt', ' ~/cuda  main ❯ ./saxpy\nok', 'co'],
  ['user@host prompt', 'me@box ❯ ls\na b', 'co'],
  ['oh-my-zsh prompt', '➜  app git:(main) ✗ ls\na b', 'co'],
  ['indented Vite ➜ is output', '$ npx vite\n  ➜  Local:   http://localhost:5173/', 'co'],
  ['function body', '$ f() {\n> echo hi\n> }\n$ f\nhi', 'cccco'],
  ['comment with a keyword', '$ ls # for files\na b', 'co'],
  ['no prompt: nothing marked', 'echo hi\nls -la', 'cc'],
  ['zsh % prompt', '% ls\na', 'co', 'zsh'],
  ['console lang', '$ ls\na', 'co', 'console'],
  ['not a shell lang: nothing marked', '$ ls\na', 'cc', 'ts'],
]

describe('terminalTransformer', () => {
  for (const [name, code, expected, lang] of CASES) {
    it(name, () => assert.equal(marks(code, lang), expected, shellLines(code, lang).join('\n')))
  }

  const MORE: [string, string, string][] = [
    ['here-string <<< is not a heredoc', '$ wc -w <<< hello\n1\n$ ls\na', 'coco'],
    ['arithmetic << is not a heredoc', '$ echo $((1 << 2))\n4', 'co'],
    ['quoted string over two lines', '$ echo "a\n> b"\na', 'cco'],
    ['quoted heredoc end word', "$ cat <<'EOF'\nhi\nEOF\nhi", 'ccco'],
  ]
  for (const [name, code, expected] of MORE)
    it(name, () => assert.equal(marks(code), expected))
})
