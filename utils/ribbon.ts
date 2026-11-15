// The confidential corner ribbon (global-bottom.vue): what it says and where,
// from the headmatter's `confidential` and a slide's own. Pure, so it is
// tested (test/ribbon.test.ts).
//
//   confidential: true                       → "CONFIDENTIAL", top-right
//   confidential: 대외비                      → that label
//   confidential: { label, company, position: top-right | top-left }
//   confidentialOn: all (default) | openers  → every slide, or only cover /
//                                              intro / section / end
//   a slide's own `confidential`            → replaces the deck's there
//                                              (false: none; true: the deck's)

import { isOff, isOn } from './frontmatter.ts'

export interface Ribbon {
  label: string
  company: string
  position: 'top-right' | 'top-left'
  /** Font scale of each line, so a long label or company name fits the band */
  labelScale: number
  companyScale: number
}

const OPENERS = ['cover', 'intro', 'section', 'end']

/** How much to shrink a line that holds `fits` characters at full size; past
 *  `min` it stays readable and the band cuts it with "…" */
export function ribbonScale(text: string, fits: number, min = 0.7): number {
  return Math.max(min, Math.min(1, Math.round((fits / Math.max(text.length, 1)) * 100) / 100))
}

export function ribbonOf(deck: unknown, deckOn: unknown, own: unknown, layout: string, isFirst = false): Ribbon | null {
  // A slide's own setting replaces the deck's there: false hides the ribbon,
  // anything else shows it as that slide asks (whatever confidentialOn says).
  // The first slide's frontmatter is the headmatter, so `own` there is the deck's
  const ownSet = !isFirst && own !== undefined && own !== null
  const value = ownSet ? own : deck
  if (value === undefined || value === null || isOff(value) || value === '') return null
  if (!ownSet && deckOn === 'openers' && !OPENERS.includes(layout)) return null

  // a slide's plain `true` keeps the deck's label and company
  const settings = ownSet && isOn(own) && deck !== undefined && deck !== null && !isOff(deck) && !isOn(deck) && deck !== '' ? deck : value
  let label = 'CONFIDENTIAL'
  let company = ''
  let position: Ribbon['position'] = 'top-right'
  if (typeof settings === 'object') {
    const o = settings as Record<string, unknown>
    if (o.label !== undefined && o.label !== null && o.label !== '') label = String(o.label)
    if (o.company !== undefined && o.company !== null) company = String(o.company)
    if (o.position === 'top-left') position = 'top-left'
  }
  else if (!isOn(settings)) {
    label = String(settings)
  }
  return { label, company, position, labelScale: ribbonScale(label, 13), companyScale: ribbonScale(company, 18, 0.8) }
}
