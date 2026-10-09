# Changelog

## Unreleased

### Fixes

- **Image paths in `image`, `full-image` and `full-split`.** A root path such as
  `image: /bg.png` ignored the deck's base, so it 404'd in a build with `--base /sub/`
  (GitHub Pages and other subpath hosting); it now resolves like Slidev's own layouts.
  In `full-image` and `full-split` a path with spaces or parentheses (`/my bg (1).png`)
  left the background empty; the URL is now quoted.
- **Editable PPTX export (`slidev export --format pptx-editable`, Slidev 52.20+).** Gradient
  text (titles, subtitles, `.gradient-text`) came out twice: as a picture of the gradient,
  and as a text box in opaque black at the same spot, which showed behind the picture on
  dark slides. PowerPoint text has no gradients, so in this export it is now plain,
  editable text in the gradient's first color. PDF and PNG exports are unchanged.

## 3.0.4

### Fixes

- **PDF export memory and size.** Shadows were drawn on a slide-sized canvas at 4× per
  slide (about 2 GB of canvas for the 78-slide example); each shadow now gets a canvas
  just big enough for it at 2×, and gradient text a canvas the size of its text. About
  9× less memory; PDFs are smaller than before 3.0.3 (example 11.9 → 8.1 MB).
- **Export safety.** A failure while redrawing one effect leaves that effect to the CSS
  and the rest carries on, and the export never waits more than 15 s (a font that never
  loads used to stall `slidev export` until it failed). Canvases that would be too big
  get a lower resolution instead of coming out blank, and browsers without the canvas
  features used (Chromium 99, Safari 16.4, Firefox 112) keep the CSS effects.

### Internal

- Each element's styles are read once per pass; text shadows only measure the element's
  own text; one transparency check.

## 3.0.3

### Fixes

- **PDF export: border light, glow and shadows.** The `anim-border` light filled the whole
  card in most PDF viewers (its mask was dropped), and macOS Preview showed every blurred
  shadow (code blocks, tables, cards, `anim-glow`, the progress bar, title text shadows)
  as a translucent rectangle. In exports they are now drawn as images, like gradient text
  in 3.0.2.
- **Export look didn't apply to `slidev export`.** The still-picture rules (no shimmer
  band, finished entrance animations, hidden `Countdown` / `PresenterNote`) were
  `@media print`, which `slidev export` doesn't use. They now hang off `html.print-mode`,
  set for `slidev export`, the browser export page and browser printing. `anim-glow`
  keeps a steady glow instead of none.

### Internal

- One `isPrintMode` for the border light and the export code; the export redraw scans
  only newly added slides after the first pass and measures one-line text as a whole.

## 3.0.2

### Fixes

- **PDF export: gradient text.** Titles, title-slide subtitles, `.gradient-text*`,
  `.anim-gradient-text*` and the quote marks are CSS gradient text, which PDF viewers draw
  differently: macOS Preview showed a solid gradient bar (or black text) instead of the
  title, other viewers a thin box around it. In exports (`slidev export`, the browser
  export page) the theme now draws that text as a high-resolution image of the same
  gradient over the original, which stays invisible in place, so the text can still be
  searched and copied. The presentation itself is unchanged.

### Example

- `npm run export` in `example/` (adds `playwright-chromium`).

## 3.0.1

### Fixes

- Slidev's web editor: the caret no longer drifts away from the text. Theme code-block
  styles (padding, border, line height) applied to the editor too; they now apply to
  slides only. Slides look the same.
- Stage indicator steps are buttons: reachable with Tab, activated with Enter / Space,
  current step announced to screen readers. Mouse clicks look and behave as before.
- `iframe` `scale`: zero, negative or non-numeric values fall back to 1 instead of
  making the page disappear.
- `progressBarSkip`: pages below 1 or past the last page are ignored, so they no longer
  skew `progressBarSkipMode: exclude`, and huge ranges stay cheap.
- `image` layout image URLs with spaces or parentheses load correctly.

### Added

- `image` layout `alt` and `iframe` layout `title` for screen readers.

## 3.0.0

Includes everything from 2.2.0 (tagged, not published to npm).

### Breaking changes

- **Removed classes** (no known use in the demo or docs):
  `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-gradient`, `.gradient-bg`,
  `.gradient-animated`, `.gradient-overlay`, `.gradient-text-animated`,
  `.gradient-card-hover`, `.gradient-border-animated`, `.gradient-blob`,
  `.gradient-blob-1/2/3`, `.gradient-unicorn-bg`, `.gradient-vibrant-bg`,
  `.gradient-soft-bg`.
- **Removed utilities that shadowed UnoCSS** (`.mt-*`, `.mb-*`, `.text-sm/lg/xl/2xl`,
  `.text-left/center/right`, `.grid-cols-2/3`, `.gap-4/6/8`). UnoCSS's own values already
  applied in practice, so slides look the same.
- **Removed unused CSS variables**: the `--blue-*` / `--purple-*` scales, `--radius-*`,
  `--syntax-*`, and others nothing in the theme read.
- **Fonts** follow the deck's `fonts:` headmatter instead of being hard-coded. The defaults
  (Noto Sans KR / JetBrains Mono, weight 400) look the same as before.
- **`intro`** headings follow the `align` prop (default `left`) instead of always being
  centered.
- **Light mode**: content slides use a light palette (cards, tables, badges, keys) and deeper
  accent colors for readable text on white. Dark mode text is one step brighter.
- **Requires Slidev 52+** (Node 20.12+).

### Upgrading from 1.x / 2.x

- Layout names from 1.x (`image-left`, `iframe-left`, `two-cols-header`, `comparison`,
  `full-center`, `full-dark`) still work as presets.
- If a slide used one of the removed classes, replace it with UnoCSS utilities or a custom
  style.
- The `grid` side padding, `flex` wrapping and `absolute` max-width inside slides are kept;
  turn them off with `--grid-padding-x: 0`, `--flex-wrap: nowrap`, `--absolute-max-width: none`.
- To keep the previous centered `intro` headings, set `align: center`.

### Features

- Progress bar: deck-wide options, `progressBarSkip` / `progressBarSkipMode`,
  `pageNumber: false`, and export-only `progressBarInExport` / `pageNumberInExport`.
- `$...$` math (KaTeX) and `x^y` superscripts in component props; `\$` for a literal dollar.
- Every size, color and speed is a CSS variable or prop (see the README's Customization).
- Effects: constant-speed animated border light, size-adaptive shimmer, em-based gradient
  text cycle, parameterized hover effects (`hover-tilt`, `hover-gradient` restored), slide
  transition speed.
- Components: `StoryBox` `color` / `icon`, `PatternCard` `sections`, `Timeline` item colors,
  `QRCode` any size / `api` / `src`, `three-cols` labels and `bottom` slot, layout
  `padding` / `contentMaxWidth`.
- `npm run check:decks` (repo only): render real decks with their theme and this repo's
  theme and report changed slides.

### Fixes

- Presenter notes show in the presenter view.
- Readable text: dark mode body / muted text, keys, link cards; light mode accents, slide
  chrome; table and quote text on title slides; full-split panel text.
- Shimmer and hover-shine were nearly invisible; animated border was clipped inside cards;
  `hover-*` lost to `.card:hover`.
- Gradient borders never showed; table corners turned square on hover; code chips in tables
  wrapped and overlapped; PatternCard slot-only sections were hidden.
- Footnote sizing, stage indicator overlapping the title, symmetric quote marks.
- Theme font defaults listed `system-ui` / `monospace`, which made the web font request fail.
- KaTeX version matches Slidev's, so math superscripts render at the right size.
