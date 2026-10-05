# Changelog

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
