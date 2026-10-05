// Title-style layouts that hide slide chrome (stage progress, page number)
export const TITLE_LAYOUTS = ['cover', 'intro', 'end']

// Page number and "content" progress bar also hide on section dividers
export const NO_PAGE_NUMBER_LAYOUTS = [...TITLE_LAYOUTS, 'section']

// Layouts with a dark background in either color mode (root has `slide-dark`);
// slide chrome on top of them keeps the dark-mode colors in light mode
export const DARK_LAYOUTS = [
  'cover', 'intro', 'section', 'end', 'quote', 'statement', 'fact',
  'full-image', 'full-split', 'full-dark',
]
