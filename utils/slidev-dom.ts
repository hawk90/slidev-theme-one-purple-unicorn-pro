// Slidev's own DOM that the theme relies on. None of it is public API: after a
// Slidev upgrade, run `npm run check:slidev` (scripts/check-slidev-internals.mjs),
// which opens the example deck and checks each of these still exists. DEV.md
// lists the CSS that relies on them too.

/** The slides' container in play mode (holds the slides and the global layers) */
export const SLIDE_CONTENT_ID = 'slide-content'
/** Inside it, the slides themselves */
export const SLIDESHOW_ID = 'slideshow'
/** One per slide, play and export: its page number */
export const SLIDE_NO_ATTR = 'data-slidev-no'
/** A slide's page wrapper; Slidev hides the others with v-show (display: none) */
export const PAGE_CLASS = 'slidev-page'
/** Each slide's layout root */
export const LAYOUT_CLASS = 'slidev-layout'
/** In an export, each slide with its own copy of the global layers */
export const PRINT_CONTAINER_CLASS = 'print-slide-container'
/** `slidev export` waits until none is left before it captures */
export const LOADING_CLASS = 'slidev-slide-loading'
/** Vue's transition classes on an entering slide page */
export const ENTERING_CLASS = /-enter-(?:from|active|to)$/

export const slideSelector = (no: number | string) => `[${SLIDE_NO_ATTR}="${no}"]`
