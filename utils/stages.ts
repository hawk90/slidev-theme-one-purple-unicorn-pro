// Stage indicator frontmatter (components/StageProgress.vue), parsed in one place

type Frontmatter = Record<string, unknown>

/** `stages`: a list; anything else (a stray string) means no indicator */
export const stagesOf = (fm: Frontmatter): string[] =>
  Array.isArray(fm.stages) ? fm.stages.map(String) : []

const sameStages = (a: string[], b: string[]) => a.length === b.length && a.every((s, i) => s === b[i])

export interface StageSlide { no: number, frontmatter: Frontmatter }

/**
 * The slide a click on stage `index` goes to, from a slide showing `stages`.
 * `stageMap` entries are page numbers or `routeAlias` names (aliases survive
 * slides being added or moved; numbers go stale). An entry that is missing,
 * past the last slide, or on a slide with other stages is reported in
 * `warning`, and the first slide with these `stages` at that `currentStage`
 * is used instead (the same search as without a stageMap).
 */
export function stageTarget(index: number, stages: string[], stageMap: unknown, slides: StageSlide[]): { no?: number, warning?: string } {
  const isStage = (s: StageSlide) => stageOf(s.frontmatter) === index && sameStages(stagesOf(s.frontmatter), stages)
  const auto = slides.find(isStage)?.no
  const entry = Array.isArray(stageMap) ? stageMap[index] : undefined
  if (entry === undefined || entry === null || entry === '') return { no: auto }

  const mapped = slides.find(s => s.no === Number(entry) || (typeof entry === 'string' && s.frontmatter.routeAlias === entry))
  if (!mapped)
    return { no: auto, warning: `stageMap[${index}] = ${JSON.stringify(entry)}: no such slide (page number past the end, or no slide with that routeAlias)` }
  if (!isStage(mapped) && auto !== undefined && auto !== mapped.no)
    return { no: auto, warning: `stageMap[${index}] = ${JSON.stringify(entry)} is slide ${mapped.no}, which is not stage ${index} of these stages (pages moved?); going to slide ${auto}` }
  return { no: mapped.no }
}

/**
 * `currentStage` as an index, or -1 when unset or not a whole number.
 * `Number('')` is 0, so an empty value must not count as the first stage.
 */
export function stageOf(fm: Frontmatter): number {
  const v = fm.currentStage
  if (v === undefined || v === null || v === '' || typeof v === 'boolean') return -1
  const n = Number(v)
  return Number.isInteger(n) && n >= 0 ? n : -1
}

// Automatic stages (`stages: auto`): one stage per section, from the slides
// themselves. A section starts at a `layout: section` slide (its title names
// it) or at a slide with `chapter: "Name"`, or slidev-addon-chapters'
// `chapter: { id, title }`; `chapter: false` leaves a section slide out.

export interface SectionSlide { no: number, title?: string, frontmatter: Frontmatter }

export interface AutoStages { stages: string[], starts: number[] }

/** A chapter's name: `chapter: "Name"`, or `{ title }` (slidev-addon-chapters) */
export function chapterName(ch: unknown): string | undefined {
  const t = ch && typeof ch === 'object' ? (ch as Record<string, unknown>).title : ch
  return typeof t === 'string' && t.trim() !== '' ? t.trim() : undefined
}

export function autoStages(slides: SectionSlide[]): AutoStages {
  const stages: string[] = []
  const starts: number[] = []
  for (const s of slides) {
    const ch = s.frontmatter.chapter
    if (ch === false || ch === 'false') continue
    const named = chapterName(ch)
    if (!named && s.frontmatter.layout !== 'section') continue
    stages.push(named ?? String(s.frontmatter.title ?? s.title ?? `Section ${stages.length + 1}`))
    starts.push(s.no)
  }
  return { stages, starts }
}

/** The section slide `no` is in: the last start at or before it (-1 before the first) */
export function autoStageIndex(starts: number[], no: number): number {
  let index = -1
  starts.forEach((start, i) => { if (start <= no) index = i })
  return index
}

/** Whether `stages` asks for the automatic ones */
export const isAutoStages = (v: unknown) => v === 'auto'

/**
 * Which labels show inline (`stageLabels`): all (default), active (only the
 * current stage's; the others on hover) or hover (a dot rail: labels on hover
 * only). Automatic stages with more than `crowded` sections default to active.
 */
export function stageLabelMode(value: unknown, auto: boolean, count: number, crowded = 6): 'all' | 'active' | 'hover' {
  if (value === 'all' || value === 'active' || value === 'hover') return value
  return auto && count > crowded ? 'active' : 'all'
}
