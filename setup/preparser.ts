// Code from real source files by line range or by content (utils/snippets.ts):
//
//   <<< @/code/kernel.cu[9-15] {2|3}
//   <<< ./reduce.cu[/__global__/,/^}/] {lines:true}
//
// becomes a fenced block with those lines (dedented, titled "kernel.cu:9-15"
// unless the line gives its own [title]) and, when the file is in a git
// repository on GitHub, GitLab or Bitbucket, a "view source" link to them
// (`snippetLinks: false` in the headmatter turns the links off; the branch
// is the upstream's or the remote's default, or `snippetBranch:`). A path that
// doesn't resolve or a range that matches nothing shows as a warning on the
// slide. Slidev's own `<<<` (a whole file, a #region) is left alone.

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { definePreparserSetup } from '@slidev/types'
import { blobUrl, dedent, parseSnippet, pickLines, snippetLang } from '../utils/snippets'
import type { BibEntry } from '../utils/bibtex'
import { parseBibtex } from '../utils/bibtex'
import { apply, collect } from '../utils/references'
import { newStructure, structureSlide } from '../utils/structure'

const git = (cwd: string, ...args: string[]) => {
  try { return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() }
  catch { return '' }
}

export default definePreparserSetup(({ filepath, headmatter }) => {
  const root = path.dirname(filepath)
  const links = headmatter.snippetLinks !== false
  const repos = new Map<string, { top: string, remote: string, branch: string } | null>()
  const repoOf = (dir: string) => {
    if (!repos.has(dir)) {
      const top = git(dir, 'rev-parse', '--show-toplevel')
      const remote = top && git(dir, 'remote', 'get-url', 'origin')
      // the branch on the remote: this one's upstream, else the remote's
      // default (a local or worktree branch may not exist there);
      // `snippetBranch:` in the headmatter names one
      const remoteBranch = (ref: string) => ref.replace(/^[^/]+\//, '')
      const branch = top && (String(headmatter.snippetBranch ?? '')
        || remoteBranch(git(dir, 'rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'))
        || remoteBranch(git(dir, 'symbolic-ref', '--short', 'refs/remotes/origin/HEAD'))
        || 'main')
      repos.set(dir, top && remote ? { top, remote, branch } : null)
    }
    return repos.get(dir)!
  }
  let structure = newStructure()

  return [{
    name: 'one-purple-unicorn:snippet-ranges',
    transformRawLines(lines) {
      let fence = ''
      for (let i = 0; i < lines.length; i++) {
        const open = /^\s*(`{3,}|~{3,})/.exec(lines[i])?.[1]
        if (open && (!fence || open.startsWith(fence))) { fence = fence ? '' : open; continue }
        if (fence) continue // inside a code block: an example of the syntax
        const ref = parseSnippet(lines[i])
        if (!ref) continue

        const file = ref.path.startsWith('@/') ? path.resolve(root, ref.path.slice(2)) : path.resolve(root, ref.path)
        const warn = (why: string) => {
          console.warn(`[theme] snippet ${ref.path}[${ref.range}]: ${why}`)
          lines.splice(i, 1, `> ⚠ \`${ref.path}[${ref.range}]\`: ${why}`)
        }
        if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { warn('no such file'); continue }
        // (a file's last newline ends its last line: no empty line after it)
        const source = fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n').replace(/\n$/, '').split('\n')
        const picked = pickLines(source, ref.range)
        if ('error' in picked) { warn(picked.error); continue }

        const lang = snippetLang(ref.path, ref.rest)
        let rest = ref.rest.replace(new RegExp(`^${lang}(?=\\s|\\{|$)`), '').trim()
        const name = path.basename(file)
        const span = picked.from === picked.to ? `${picked.from}` : `${picked.from}-${picked.to}`
        if (!/\[[^\]]*\]/.test(rest)) rest = `[${name}:${span}] ${rest}`
        const body = dedent(source.slice(picked.from - 1, picked.to))

        const out = [`\`\`\`${lang} ${rest}`.trimEnd(), ...body, '```']
        const repo = links ? repoOf(path.dirname(file)) : null
        const url = repo && blobUrl(repo.remote, repo.branch, path.relative(repo.top, file).split(path.sep).join('/'), picked.from, picked.to)
        if (url) out.push('', `<a class="snippet-source" href="${url}" target="_blank" rel="noopener">${name}#L${span.replace('-', '-L')} ↗</a>`)
        lines.splice(i, 1, ...out)
        i += out.length - 1
      }
    },
  }, {
    // Citations and numbered labels (utils/references.ts): `bibliography:
    // refs.bib` (or a list) in the headmatter, [@key] in the text, and
    // <References /> where the list goes
    name: 'one-purple-unicorn:references',
    transformRawLines(lines) {
      const files = [headmatter.bibliography].flat().filter(Boolean).map(String)
      const bib = new Map<string, BibEntry>()
      for (const f of files) {
        const file = path.resolve(root, f.replace(/^@\//, ''))
        if (!fs.existsSync(file)) { console.warn(`[theme] bibliography ${f}: no such file`); continue }
        for (const e of parseBibtex(fs.readFileSync(file, 'utf8'))) bib.set(e.key, e)
      }
      const numbered = collect(lines, k => bib.has(k))
      if (!numbered.cites.length && !numbered.labels.size && !lines.some(l => /<References\b/.test(l))) return
      apply(lines, numbered, bib, w => console.warn(`[theme] reference: ${w}`))
    },
  }, {
    // Sections, transitions and continued titles (utils/structure.ts), with
    // `structure: true` (or `structure: { transitions: false }`)
    name: 'one-purple-unicorn:structure',
    transformRawLines() { structure = newStructure() }, // runs before the slides are cut: one parse, one walk
    transformSlide(content, frontmatter) {
      const opt = headmatter.structure
      if (!opt || opt === 'false') return undefined
      return structureSlide(structure, content, frontmatter, !(typeof opt === 'object' && opt.transitions === false))
    },
  }]
})
