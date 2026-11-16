// A small BibTeX reader and formatter for citations (setup/preparser.ts):
// enough for the entries papers and talks cite (article, inproceedings,
// book, misc, online…). Pure, so it is tested (test/bibtex.test.ts).

export interface BibEntry { type: string, key: string, fields: Record<string, string> }

/** Read the entries of a .bib file (comments and @string/@preamble skipped) */
export function parseBibtex(text: string): BibEntry[] {
  const out: BibEntry[] = []
  const re = /@(\w+)\s*[{(]\s*([^,\s]+)\s*,/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    const type = m[1].toLowerCase()
    if (type === 'comment' || type === 'string' || type === 'preamble') continue
    // the entry's body: up to the brace that closes it
    let depth = 1
    let i = re.lastIndex
    for (; i < text.length && depth > 0; i++) {
      if (text[i] === '{' || text[i] === '(') depth++
      else if (text[i] === '}' || text[i] === ')') depth--
    }
    const body = text.slice(re.lastIndex, i - 1)
    re.lastIndex = i
    out.push({ type, key: m[2], fields: parseFields(body) })
  }
  return out
}

function parseFields(body: string): Record<string, string> {
  const fields: Record<string, string> = {}
  let i = 0
  while (i < body.length) {
    const m = /\s*([\w-]+)\s*=\s*/y
    m.lastIndex = i
    const name = m.exec(body)
    if (!name) break
    i = m.lastIndex
    let value = ''
    if (body[i] === '{' || body[i] === '"') {
      const close = body[i] === '{' ? '}' : '"'
      let depth = 1
      let j = i + 1
      for (; j < body.length; j++) {
        if (close === '}' && body[j] === '{') depth++
        else if (body[j] === close && (close === '"' ? body[j - 1] !== '\\' : true)) {
          if (close === '"' || --depth === 0) break
        }
      }
      value = body.slice(i + 1, j)
      i = j + 1
    }
    else {
      const end = body.slice(i).search(/[,\n]/)
      value = (end === -1 ? body.slice(i) : body.slice(i, i + end)).trim()
      i = end === -1 ? body.length : i + end
    }
    fields[name[1].toLowerCase()] = clean(value)
    const comma = body.indexOf(',', i)
    i = comma === -1 ? body.length : comma + 1
  }
  return fields
}

/** BibTeX text to plain text: braces, simple accents and escapes */
function clean(s: string): string {
  return s
    .replace(/\\[`'^"~=.]\{?(\w)\}?/g, '$1')
    .replace(/\\&/g, '&').replace(/\\%/g, '%').replace(/\\_/g, '_')
    .replace(/--/g, '–')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** "Last, First and Other, Name" → "First Last, Name Other" (3+: "et al.") */
export function formatAuthors(authors: string, max = 3): string {
  const people = authors.split(/\s+and\s+/).map(a => a.trim()).filter(Boolean).map((a) => {
    const [last, first] = a.split(/\s*,\s*/)
    return first ? `${first} ${last}` : last
  })
  if (people.length > max) return `${people[0]} et al.`
  if (people.length <= 2) return people.join(' and ')
  return `${people.slice(0, -1).join(', ')}, and ${people[people.length - 1]}`
}

/** One reference, as Markdown: authors, *title*, venue, year, and a link */
export function formatEntry(e: BibEntry): string {
  const f = e.fields
  const parts: string[] = []
  if (f.author || f.editor) parts.push(formatAuthors(f.author || f.editor))
  if (f.title) parts.push(`*${f.title}*`)
  const venue = f.journal || f.booktitle || f.publisher || f.howpublished || f.school || f.institution
  if (venue) parts.push(venue + (f.volume ? ` ${f.volume}${f.number ? `(${f.number})` : ''}` : ''))
  if (f.year) parts.push(f.year)
  let text = parts.join(', ')
  const url = f.doi ? `https://doi.org/${f.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, '')}` : f.url
  if (url) text += ` [↗](${url})`
  return `${text}.`
}

/** A short form for a citation's tooltip: "Author (year): title" */
export function shortEntry(e: BibEntry): string {
  const f = e.fields
  const who = f.author ? formatAuthors(f.author, 1) : ''
  return [who && `${who}${f.year ? ` (${f.year})` : ''}`, f.title].filter(Boolean).join(': ')
}
