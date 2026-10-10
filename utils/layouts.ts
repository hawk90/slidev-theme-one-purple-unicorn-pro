// Layouts without the stage indicator (and without the page number, below).
// Not the `slide-title` class: section has that but keeps the stage indicator
export const TITLE_LAYOUTS = ['cover', 'intro', 'end']

// Page number and "content" progress bar also hide on section dividers
export const NO_PAGE_NUMBER_LAYOUTS = [...TITLE_LAYOUTS, 'section']

// Dark layouts are the ones whose root has `slide-dark` (styles/colors.css)
