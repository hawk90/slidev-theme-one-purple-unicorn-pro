// A published deck's text, written next to it by `slidev build` (vite.config.ts):
// - llms.txt: the deck as plain Markdown, for search and language models:
//   each slide's title, its text and its speaker notes;
// - handout.html: the same for people, one page to read or print after the
//   talk, each section linking back to its slide.
// `handout: false` in the headmatter turns both off. Pure, so it is tested.

export interface DeckSlide { no: number, title: string, content: string, note: string, hidden: boolean }

/** A slide's Markdown without what only renders on the slide: comments, components, HTML tags (their text stays), click markers */
export function cleanSlide(content: string): string {
  const fences: string[] = []
  let text = content.replace(/^(`{3,}|~{3,})[^]*?^\1/gm, (m) => { fences.push(m); return `\u0000${fences.length - 1}\u0000` })
  text = text.replace(/`[^`\n]+`/g, (m) => { fences.push(m); return `\u0000${fences.length - 1}\u0000` }) // inline code too
  text = text
    .replace(/<!--[^]*?-->/g, '')
    .replace(/^::[\w-]+::\s*$/gm, '') // slot markers (::left::)
    .replace(/<[A-Z][\w-]*\b[^>]*\/>/g, '') // self-closing components
    .replace(/<\/?[A-Za-z][\w-]*\b[^>]*>/g, '') // other tags: their text stays
    .replace(/\{\{[^}]*\}\}/g, '') // Vue interpolations
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
  return text.replace(/\u0000(\d+)\u0000/g, (_, i) => fences[Number(i)]).trim()
}

/** The slide's text without its `# title` line (the title is given apart), headings one level down */
function body(content: string) {
  const fences: string[] = []
  return cleanSlide(content)
    .replace(/^#\s+.*\n*/, '')
    .replace(/^(`{3,}|~{3,})[^]*?^\1/gm, (m) => { fences.push(m); return `\u0000${fences.length - 1}\u0000` })
    .replace(/^(#{1,5})(?=\s)/gm, '#$1') // a slide's own headings sit under its section
    .replace(/\u0000(\d+)\u0000/g, (_, i) => fences[Number(i)])
    .trim()
}

export function deckText(slides: DeckSlide[], info: { title: string, author?: string, event?: string, date?: string, url?: string }): string {
  const meta = [info.author, info.event, info.date].filter(Boolean).join(' · ')
  const out = [`# ${info.title}`, '']
  if (meta) out.push(`> ${meta}`, '')
  if (info.url) out.push(`Slides: ${info.url}`, '')
  for (const s of slides.filter(s => !s.hidden)) {
    out.push(`## ${s.no}. ${s.title || 'Untitled'}`, '')
    const text = body(s.content)
    if (text) out.push(text, '')
    if (s.note.trim()) out.push(`Notes: ${cleanSlide(s.note).replace(/\n+/g, ' ')}`, '')
  }
  return `${out.join('\n').trim()}\n`
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** A standalone page; `render` turns Markdown into HTML (the deck's markdown-it) */
export function handoutHtml(slides: DeckSlide[], info: { title: string, author?: string, event?: string, date?: string }, render: (md: string) => string, base = '/'): string {
  const meta = [info.author, info.event, info.date].filter(Boolean).map(esc).join(' · ')
  const sections = slides.filter(s => !s.hidden).map((s) => {
    const text = body(s.content)
    const note = s.note.trim() ? `<aside class="note">${render(cleanSlide(s.note))}</aside>` : ''
    return `<section id="slide-${s.no}"><h2><a href="${esc(base)}${s.no}">${s.no}</a> ${esc(s.title || 'Untitled')}</h2>${text ? render(text) : ''}${note}</section>`
  }).join('\n')
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(info.title)} · handout</title>
<style>
body { max-width: 46rem; margin: 2rem auto; padding: 0 1rem; font: 16px/1.6 system-ui, "Noto Sans KR", sans-serif; color: #1a1d23; word-break: keep-all; }
h1 { margin-bottom: 0.2rem; } .meta { color: #4b5563; margin-top: 0; }
section { border-top: 1px solid #e5e7eb; padding-top: 0.5rem; margin-top: 1.5rem; break-inside: avoid; }
h2 a { color: #7f3396; text-decoration: none; font-variant-numeric: tabular-nums; margin-right: 0.3rem; }
pre { background: #21252b; color: #c0c6d0; padding: 0.75rem; border-radius: 6px; overflow-x: auto; white-space: pre-wrap; }
code { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 0.9em; }
.note { border-left: 3px solid #c678dd; padding-left: 0.75rem; color: #4b5563; font-size: 0.95em; }
img { max-width: 100%; }
@media print { body { margin: 0; } h2 a { color: inherit; } }
</style>
</head>
<body>
<h1>${esc(info.title)}</h1>
${meta ? `<p class="meta">${meta}</p>` : ''}
${sections}
</body>
</html>
`
}
