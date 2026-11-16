// Code from real source files by line range or by content (setup/preparser.ts):
//
//   <<< @/code/kernel.cu[9-15] {2|3}
//   <<< ./reduce.cu[/__global__/,/^}/] {lines:true}
//
// Slidev's own `<<<` takes a whole file or a #region; this adds the part in
// [brackets], so the example files need no region markers and stay
// compilable. Pure parts here, tested (test/snippets.test.ts).

const SNIPPET = /^<<<\s+(\S+?)\[([^\]]+)\](.*)$/

export interface SnippetRef {
  path: string
  /** the bracket's text: 9-15, 9-, 9, or /start/,/end/ */
  range: string
  /** what followed: a language, highlight {…}, options */
  rest: string
}

export function parseSnippet(line: string): SnippetRef | null {
  const m = SNIPPET.exec(line.trim())
  return m ? { path: m[1], range: m[2].trim(), rest: m[3].trim() } : null
}

const anchor = (s: string) => {
  const m = /^\/(.+)\/([a-z]*)$/.exec(s.trim())
  return m ? new RegExp(m[1], m[2]) : null
}

/**
 * The lines a range picks (1-based, inclusive), or an error. `9-15`, `9-`
 * (to the end), `9`; `/start/,/end/`: from the first line matching start to
 * the first line after it matching end (both included); `/start/` alone: to
 * the end of the file.
 */
export function pickLines(lines: string[], range: string): { from: number, to: number } | { error: string } {
  const num = /^(\d+)\s*(?:-\s*(\d*))?$/.exec(range)
  if (num) {
    const from = Number(num[1])
    const to = num[2] === undefined ? from : num[2] === '' ? lines.length : Number(num[2])
    if (from < 1 || from > lines.length || to < from) return { error: `lines ${range}: the file has ${lines.length}` }
    return { from, to: Math.min(to, lines.length) }
  }
  const [a, b] = range.split(/\s*,\s*(?=\/)/)
  const start = anchor(a ?? '')
  const end = b === undefined ? null : anchor(b)
  if (!start || (b !== undefined && !end)) return { error: `"${range}" is not a line range or /anchor/,/anchor/` }
  const from = lines.findIndex(l => start.test(l)) + 1
  if (!from) return { error: `no line matches ${a}` }
  if (!end) return { from, to: lines.length }
  const to = lines.findIndex((l, i) => i >= from && end.test(l)) + 1
  if (!to) return { error: `no line after line ${from} matches ${b}` }
  return { from, to }
}

/** Drop the indent the lines share */
export function dedent(lines: string[]): string[] {
  const indents = lines.filter(l => l.trim()).map(l => /^[ \t]*/.exec(l)![0].length)
  const cut = indents.length ? Math.min(...indents) : 0
  return lines.map(l => l.slice(cut))
}

/**
 * A browser link to lines of a file in its repository: GitHub, GitLab and
 * Bitbucket remotes (ssh or https). Null for other hosts.
 */
export function blobUrl(remote: string, branch: string, file: string, from: number, to: number): string | null {
  const m = /^(?:https?:\/\/(?:[^@/]+@)?|git@|ssh:\/\/git@)([^/:]+)[/:]([^/]+\/[^/]+?)(?:\.git)?\/?$/.exec(remote.trim())
  if (!m) return null
  const [, host, repo] = m
  const lines = from === to ? `L${from}` : `L${from}-L${to}`
  const path = file.split('/').map(encodeURIComponent).join('/')
  if (host.includes('github')) return `https://${host}/${repo}/blob/${encodeURIComponent(branch)}/${path}#${lines}`
  if (host.includes('gitlab')) return `https://${host}/${repo}/-/blob/${encodeURIComponent(branch)}/${path}#${lines}`
  if (host.includes('bitbucket')) return `https://${host}/${repo}/src/${encodeURIComponent(branch)}/${path}#lines-${from}:${to}`
  return null
}

const LANGS: Record<string, string> = { cu: 'cuda', cuh: 'cuda', h: 'cpp', hpp: 'cpp', cc: 'cpp', py: 'python', rs: 'rust', js: 'js', ts: 'ts', md: 'md', sh: 'bash' }

/** The fence's language: the one given after the snippet, else the extension's */
export function snippetLang(path: string, rest: string): string {
  const given = /^([\w+-]+)(?=\s|\{|$)/.exec(rest)?.[1]
  if (given) return given
  const ext = /\.(\w+)$/.exec(path)?.[1] ?? ''
  return LANGS[ext] ?? ext
}
