// Reading slide frontmatter and the deck's headmatter. Pure; used by the
// chrome (global-bottom.vue), the cover and utils/talk-info.ts.

import type { SlideInfo } from '@slidev/types'

export type Info = Record<string, unknown>

/** Whether a slide (route meta.slide) is the deck's first, whose frontmatter is
 *  the headmatter: index is its place in the whole deck, hidden slides included */
export const isHeadmatterSlide = (slide?: Pick<SlideInfo, 'index'>) => slide?.index === 0

/** The headmatter, from Slidev's `configs` (it keeps the headmatter even when
 *  the first slide is hidden). `configs` carries Slidev's defaults too: a deck
 *  without a title (and no heading on its first slide) has title "Slidev",
 *  which is not the talk's */
export const headmatterOf = (configs: Info): Info =>
  ({ ...configs, title: configs.title === 'Slidev' ? undefined : configs.title })

/** A frontmatter flag set off / on (YAML may give a string) */
export const isOff = (v: unknown) => v === false || v === 'false'
export const isOn = (v: unknown) => v === true || v === 'true'
