// Marker class on every piece of slide chrome next to the slides: the
// progress bar, footer line, page number (global-bottom.vue) and stage
// indicator (StageProgress.vue). The light-mode restore (light-theme.css) and
// the export redraw (print-export.ts) find the chrome by it.
export const CHROME_CLASS = 'slide-chrome'

// Layouts without the stage indicator (and without the page number, below).
// Not the `slide-title` class: section has that but keeps the stage indicator
export const TITLE_LAYOUTS = ['cover', 'intro', 'end']

// Page number and "content" progress bar also hide on section dividers
export const NO_PAGE_NUMBER_LAYOUTS = [...TITLE_LAYOUTS, 'section']

// Layouts whose image or embedded page reaches the slide's bottom edge: the
// footer line hides there unless the slide asks for it with its own `footer:`
// (aliases included: currentLayout is the name the slide wrote)
export const MEDIA_LAYOUTS = [
  'image', 'image-left', 'image-right',
  'iframe', 'iframe-left', 'iframe-right',
  'full-image', 'full-split',
]
