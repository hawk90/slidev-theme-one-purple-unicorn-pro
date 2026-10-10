// The talk's details, written once in the headmatter and shown by the cover
// (layouts/cover.vue) and the footer line (global-bottom.vue):
//
//   title: …              # Slidev's own
//   author: Jane Doe      # Slidev's own (also the PDF/PPTX author): one name
//   authors:              # several people, each a name or { name, affiliation }
//   affiliation: …
//   event: GTC 2026
//   date: '2026-10-09'
//   logo: /logo.svg       # from public/

import type { SlideInfo } from '@slidev/types'

type Info = Record<string, unknown>

export interface Person { name: string, affiliation?: string }

/** Whether a slide (route meta.slide) is the deck's first, whose frontmatter is
 *  the headmatter: index is its place in the whole deck, hidden slides included */
export const isHeadmatterSlide = (slide?: Pick<SlideInfo, 'index'>) => slide?.index === 0

/** The headmatter, from Slidev's `configs` (it keeps the headmatter even when
 *  the first slide is hidden). `configs` carries Slidev's defaults too: a deck
 *  without a title (and no heading on its first slide) has title "Slidev",
 *  which is not the talk's */
export const headmatterOf = (configs: Info): Info =>
  ({ ...configs, title: configs.title === 'Slidev' ? undefined : configs.title })

export const isOff = (v: unknown) => v === false || v === 'false'
export const isOn = (v: unknown) => v === true || v === 'true'
const isEmpty = (v: unknown) => v == null || v === '' || typeof v === 'boolean'

/** A value as text: `date: 2026-10-09` comes from YAML as a Date */
const text = (v: unknown) => isEmpty(v) ? '' : v instanceof Date ? v.toISOString().slice(0, 10) : String(v)

/** `authors` (a list) or else `author` */
export function people(info: Info): Person[] {
  const list = info.authors ?? info.author
  return (Array.isArray(list) ? list : [list]).flatMap((p): Person[] => {
    const { name, affiliation } = p && typeof p === 'object' ? p as Info : { name: p, affiliation: undefined }
    return text(name) ? [{ name: text(name), ...(text(affiliation) && { affiliation: text(affiliation) }) }] : []
  })
}

const DETAILS = ['author', 'authors', 'affiliation', 'event', 'date', 'logo']

/**
 * The details a cover shows, or null. The first slide shows them unless
 * `coverInfo: false`; another cover only with `coverInfo: true`, and its own
 * values replace the deck's.
 */
export function coverInfo(frontmatter: Info, headmatter: Info, isFirst: boolean) {
  const flag = frontmatter.coverInfo
  if (isOff(flag) || (!isFirst && !isOn(flag))) return null
  const info: Info = { ...headmatter }
  for (const k of DETAILS) if (frontmatter[k] !== undefined) info[k] = frontmatter[k]
  if (frontmatter.author !== undefined && frontmatter.authors === undefined) delete info.authors

  // A cover with its own people doesn't give them the deck's affiliation
  const ownPeople = !isFirst && (frontmatter.author !== undefined || frontmatter.authors !== undefined)
  const result = {
    people: people(info),
    affiliation: ownPeople && frontmatter.affiliation === undefined ? '' : text(info.affiliation),
    parts: [text(info.event), text(info.date)].filter(Boolean),
    logo: text(info.logo),
  }
  return result.people.length || result.affiliation || result.parts.length || result.logo ? result : null
}

const FOOTER_PARTS = ['title', 'author', 'event', 'date', 'logo']

/**
 * What the footer line shows: `true` → title · author · event · date and the
 * logo (those that are set); a list → those, in its order. Null when off.
 */
export function footerParts(value: unknown, headmatter: Info) {
  const keys = Array.isArray(value) ? value.map(String) : isOn(value) ? FOOTER_PARTS : null
  if (!keys) return null
  const parts = keys.filter(k => k !== 'logo').map((k) => {
    if (k === 'author' || k === 'authors') return people(headmatter).map(p => p.name).join(', ')
    return text(headmatter[k])
  }).filter(Boolean)
  return { text: parts.join(' · '), logo: keys.includes('logo') ? text(headmatter.logo) : '' }
}
