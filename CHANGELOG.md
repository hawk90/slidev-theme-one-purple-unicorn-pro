# Changelog

## Unreleased

### Features

- **Code blocks.** A titled block (```` ```ts [file.ts] ````) and `::code-group` tabs
  get a window title bar with macOS dots, joined to the code (names line up; no
  file-type icon slot). Line numbers read `12 │ code` with a gutter for three digits.
  Line focus (`{2-3}`, `{1|2-3|all}`) dims the other lines to 0.45, or, with
  `code-focus-tint` / `themeConfig.codeFocus: tint`, tints the focused lines and dims
  nothing. Shell blocks with prompt lines (`$`, `%`, `❯`, `➜`) show output muted.
  Nerd Font icons render (the symbols-only font is bundled, loaded on demand). Long
  lines wrap under their code instead of scrolling: a slide's code never shows a
  scrollbar.
- **Brand colors from `themeConfig`.** `primary` derives the brand scale, glows,
  progress bar, cover gradients and light-mode shades (deepened to 4.5:1 on white);
  `secondary` sets the gradient partner (default: picked from `primary`); `accents`
  recolor blue / cyan / green / yellow / red with their light shades and alert tints.
  Without them, nothing changes.
- **Gradients and tints follow the color tokens.** The text, unicorn and glass gradients,
  hover glows, progress glow and light-mode shimmer were fixed purple/blue; they now use
  `--primary-400` / `--secondary-400`, so a `:root` override reaches them too. In light
  mode, `--secondary-400` follows `--light-secondary` (no longer `--light-blue`).
- **Talk details on the cover and in a footer line.** Write `author` (or `authors`,
  each a name or `{ name, affiliation }`), `affiliation`, `event`, `date` and `logo`
  once in the headmatter. The first slide's `cover` shows them under the title
  (`coverInfo: false` turns that off; another cover shows them with `coverInfo: true`
  and can replace any of them). `footer: true` shows title · author · event · date and
  the logo at the bottom left of content slides, or `footer: [title, event]` picks
  them; a slide's own `footer` (`false`, `true`, a list) replaces the deck's;
  `footerInExport: false` leaves it out of exports. The footer is off unless set.
  A deck whose headmatter already has `author` now shows it on its cover.
- **`quote` takes a `>` blockquote** as the quote, with the attribution after it.

### Fixes

- **CUDA highlighting colored names inside strings and comments** (`"cudaMalloc failed"`,
  `// kernel<<<g, b>>>`); it skips them now. Launches with nested template arguments
  (`foo<std::vector<int>><<<g, b>>>`) are marked. It looks names up in one table
  instead of running 13 patterns over every piece of text (same output).
- **Shell sessions:** the lines of a `for … done` / `if … fi` / `{ … }` block, a pipe or
  `&&` at the end of a line, and a heredoc were muted as output; they stay commands.
  In a `$` session, an output line containing ` ❯ ` was taken for a prompt. A `<<<`
  here-string or `$((a << b))` no longer counts as a heredoc, and a quoted string
  over two lines stays the command.
- **PDF export: shadows and gradient text near black, red, yellow or green boxes.**
  `rgb(0, 0, 0)` and other opaque colors whose last channel is 0 were taken for
  transparent.
- **`layout: none`:** `--code-max-height`, `--image-max-height`, heading line height,
  and table and code-block spacing now apply there too.
- **Code lines were centered on centered layouts** (cover, center…); they start at the
  left now.
- **The first lines of a code block sometimes came out in one color** (in dev and in
  exports, on a busy machine): Shiki gives up on a line after 500 ms and leaves the
  rest as one token, and the first lines are highlighted while a heavy grammar (C++)
  is still compiling. The theme now sets no per-line time limit.
- **`quote` lost its closing mark** when the quote was a heading (`# "…"`) or a single
  paragraph with no attribution, and a lone paragraph was styled as an attribution.
- **A `<Footnote>` overlapped a bottom stage indicator** (`stagePosition: bottom`); it now
  sits above it (and above the new footer line).
- **Monaco code blocks (`{monaco}`, `{monaco-run}`) never showed their editor.** The
  code theme was named "One Purple Unicorn", and Monaco rejects theme names with
  spaces ("Illegal theme name!"), so the editor failed to start; it is now
  `one-purple-unicorn`. The editor box was also light in light mode under this
  theme's dark token colors, and its lines were centered on cover/center layouts;
  it now has the dark code background and left-aligned lines.
- **macOS buttons lost their colors.** In dark mode, and on content slides in light
  mode, Primary / Destructive / Success / Toolbar all came out as the plain gray
  button; a plain button on a dark layout in light mode was dark-on-dark. Dark mode now
  switches the buttons through variables, so the color variants win.
- **Light mode overrode a slide's own styling.** A background class (`class: bg-red-500`),
  text color utilities (`text-red-500`), component link colors and button styles were
  replaced by the light-mode rules; they now win as in dark mode. Dark layouts in light
  mode keep their own text color (and `--cover-text`), as in dark mode.
- **Code blocks and images were capped by the browser window** (`60vh` / `70vh`): the
  cap only hit small windows (never fullscreen or exports, where the slide is scaled up),
  so a deck looked different by window size. There is no cap now unless you set
  `--code-max-height` / `--image-max-height`. A narrow window also changed slide padding;
  that rule is gone.
- **Theme styles leaked into Slidev's own UI** (a purple nav icon, gradient headings in
  presenter notes); heading, text, link, list, table and quote styles now apply in
  slides only.
- **`slidev export --dark`** drew shadows and gradient text with light-mode colors when
  the color scheme switched after load; the redraws are now undone and redone.
  `--per-slide` exports now also wait for them.
- **CUDA highlighting** styled every `<<` / `>>` (e.g. `std::cout << x`, `x >> 2`) as a
  kernel launch and missed templated launches (`add<float><<<g, b>>>`); only
  `<<<…>>>` launches are marked now.
- **Deck options with a hidden first slide.** With `hide: true` on the first slide, the
  footer, progress bar options and cover details read the next slide; they now read the
  headmatter, and the footer's title falls back to the first heading like Slidev's.
- **`layout: image` without `image`** crashed the slide (and dropped it from a PDF).
- **`two-cols` / `three-cols` widths as numbers** (`leftWidth: 2`) stacked the columns;
  a number is now a share (`2fr`).
- **`Countdown`** started when the deck loaded (Slidev mounts all slides), so a timer
  further in was already running; it now starts when its slide is shown. Fractional or
  negative `minutes` are rounded to whole seconds and floored at 0.
- **`Timeline active="1"`**, **`StageProgress`** with `stages` as a string,
  **`PatternCard`** with a `<div>` in its slot (last rule kept), and **`QRCode ecc="h"`**
  (lowercase) now work.
- `full-image` also takes `backgroundPosition` (as `full-split` does); page ranges accept
  an en dash (`1–3`).

## 3.0.5

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
- **Browser export page in hash and memory router mode.** With `routerMode: hash` or
  `memory`, the export page (`/#/export`, or `/export` reached inside the app) wasn't
  recognized as an export: no still effects, no PDF-viewer redraws, `Countdown` shown.
  Print mode now asks the router, as Slidev's own `isPrintMode` does.
- **Offline toast in exports.** With `pwa` on, Slidev's "Caching for offline…" toast
  appeared in every exported slide (and the OG image) over the page number; it is now
  hidden in exports.
- **Korean line breaks.** Browsers break Hangul between any two syllables, so words
  were split across lines ("드라이버" / "와", "맛보기입" / "니다", "(제" / "안)"). Slide text now
  wraps between words (`word-break: keep-all`); a token longer than the line, such as a
  URL, still wraps.
- **Export detection on decks hosted under `/export/`.** Any page whose path contained
  `/export` counted as an export, so a deck served from such a path (or a static build's
  `/export` URL, which is just a slide) ran in print mode: still effects, no
  animations. Exports are now recognized from the router only.

### Changes

- **`<QRCode>` works offline.** It used to fetch its image from api.qrserver.com, which
  needed the network (an offline talk or export showed a broken image) and sent the URL
  to a third party. It is now generated in the browser as a crisp SVG. The image used
  to be blurred at most sizes: a fixed 200 px image was stretched to `xl` and scaled
  to the others. It is also a link now. `url` is optional: without it the code points
  to the deck (`seoMeta.ogUrl`, or where it is served, `--base` and `routerMode`
  applied), or with `slide` to a slide. New `ecc` prop. `api` still selects a service,
  with a new `{size}` placeholder. Text too long for a QR code shows no code and a
  console warning, rather than taking the whole component with it.
- **Light mode reaches everything on the page.** The light palette used to be set on
  content slides and the theme's own chrome only, so anything drawn outside
  `.slidev-layout`, such as a deck's or addon's `global-top.vue` and Slidev's presenter
  and overview pages, kept the dark colors in light mode. It is now set on `<body>`,
  and dark layouts (`slide-dark`) and their chrome (`chrome-on-dark`) get the dark
  values back, a deck's own overrides on `:root` included. Slides look the same: the 78 example slides export pixel-identical in
  light mode, and dark mode is untouched. The "No notes for this slide" text in the
  presenter and overview views is now readable in light mode.

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
