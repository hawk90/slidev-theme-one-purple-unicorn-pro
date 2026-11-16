// The deck's structure, stamped into its slides at parse time (setup/
// preparser.ts, with `structure: true` in the headmatter):
// - sections start where automatic stages do (utils/stages.ts): a `layout:
//   section` slide, or `chapter:` (a name, or `{ title }`); every slide after
//   one gets `sectionTitle` and `sectionNo` in its frontmatter, for layouts,
//   footers and `{{ $frontmatter.sectionTitle }}` in the text (not `section`:
//   slidev-addon-timing-bar reads that one);
// - transitions: `slide-left` into a new section, `slide-up` within one
//   (a slide's own `transition` wins);
// - `continued: true` (or a suffix, `continued: (계속)`) on a slide without its
//   own `# ` title carries the last title over: "Title (cont.)".

import { chapterName } from './stages.ts' // .ts: node --test loads this file directly

type Fm = Record<string, any>

export interface Structure { slides: number, section: string, sectionNo: number, lastTitle: string }

export const newStructure = (): Structure => ({ slides: 0, section: '', sectionNo: 0, lastTitle: '' })

/** The slide's `# ` title, outside code blocks */
const h1 = (content: string) => /^#\s+(.+?)\s*$/m.exec(content.replace(/^(`{3,}|~{3,})[^]*?^\1/gm, ''))?.[1]

/** Stamp one slide (in order); returns its new content when it changed */
export function structureSlide(state: Structure, content: string, fm: Fm, transitions = true): string | undefined {
  if (state.slides++ === 0) return undefined // the cover: the headmatter's slide
  const ch = fm.chapter
  const named = chapterName(ch)
  const start = ch !== false && ch !== 'false' && (!!named || fm.layout === 'section')
  if (start) {
    state.sectionNo++
    state.section = named ?? String(fm.title ?? h1(content) ?? `Section ${state.sectionNo}`)
  }
  if (state.sectionNo > 0) {
    fm.sectionTitle ??= state.section
    fm.sectionNo ??= state.sectionNo
  }
  if (transitions && fm.transition === undefined) fm.transition = start ? 'slide-left' : 'slide-up'

  const own = h1(content)
  if (fm.continued && fm.continued !== 'false' && !own && state.lastTitle) {
    const title = `${state.lastTitle} ${typeof fm.continued === 'string' ? fm.continued : '(cont.)'}`
    fm.title ??= title
    return `# ${title}\n\n${content}`
  }
  if (own || typeof fm.title === 'string') state.lastTitle = String(fm.title ?? own)
  return undefined
}
