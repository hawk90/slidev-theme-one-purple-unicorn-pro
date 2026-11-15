// Stage indicator frontmatter (components/StageProgress.vue), parsed in one place

type Frontmatter = Record<string, unknown>

/** `stages`: a list; anything else (a stray string) means no indicator */
export const stagesOf = (fm: Frontmatter): string[] =>
  Array.isArray(fm.stages) ? fm.stages.map(String) : []

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
