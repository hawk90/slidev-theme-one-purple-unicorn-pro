# One Purple Unicorn Pro - Slidev Theme

A Slidev theme with purple → blue gradients and One Dark colors, built for technical talks.

## Features

- **Light & dark modes**: content slides switch palettes; title and emphasis slides stay dark
- **Korean + English**: Noto Sans KR by default, any font via `fonts:`
- **Layouts**: title, columns, image/iframe, quote/statement/fact, full-bleed
- **Components**: badges, keys, footnotes, link cards, story boxes, pattern cards, complexity tables (with KaTeX), timelines, countdown, QR codes
- **Effects**: animated borders, shimmer, glow, gradient text, entrance animations, hover effects
- **Code**: custom One Dark-based Shiki theme (incl. CUDA/C++ keywords), window title bars, line numbers, line focus, shell sessions, Nerd Font icons; long lines wrap (never a scrollbar)
- **Customizable**: every size, color and speed has a default and a variable or prop

## Installation

```bash
npm install slidev-theme-one-purple-unicorn-pro
```

Requires Slidev 52 or later (Node 20.12+; Slidev 53 needs Node 22.12+).

## Usage

```yaml
---
theme: slidev-theme-one-purple-unicorn-pro
---

# Your Presentation Title
```

The demo deck in [`example/slides.md`](example/slides.md) shows every layout, component and effect.

## Theme Modes

Set the color mode for the whole deck in the headmatter (Slidev applies it deck-wide):

```yaml
---
colorSchema: auto   # auto (default, follows the system / toggle) | light | dark
---
```

Content slides switch between light and dark palettes. These layouts stay dark in both modes: `cover`, `intro`, `section`, `end`, `quote`, `statement`, `fact`, `full-image`, `full-split`, `full-dark`. Code blocks always use the dark code theme.

## Fonts

Fonts follow Slidev's `fonts:` headmatter. The theme's defaults are Noto Sans KR / Inter (sans), Noto Serif KR (serif) and JetBrains Mono / Fira Code (mono):

```yaml
---
fonts:
  sans: Pretendard
  mono: D2Coding
  weights: '400,700'   # the theme loads 400 only by default
---
```

List only web font names (Slidev loads them from Google Fonts by default); generic names like `system-ui` or `monospace` make the whole font request fail. Slidev adds system fallbacks itself.

The quote mark uses a serif and the macOS button styles use the system UI font by design.

## Layouts

| Layout | Use | Options (frontmatter) |
|---|---|---|
| `cover`, `intro`, `section`, `end` | Title slides | `padding`, `contentMaxWidth` (`intro`: also `align`, default `left`; `cover`: the talk's details, see [Talk details](#talk-details-cover-and-footer)) |
| `default` | Content slide (title pinned at the top) | |
| `center` | Centered content | `padding`, `contentMaxWidth` |
| `two-cols`, `three-cols` | Columns with a header (default slot) and a `bottom` slot | `leftWidth`, `centerWidth`, `rightWidth`, `divider`, `leftLabel`, `centerLabel`, `rightLabel`, `leftLabelColor`, `centerLabelColor`, `rightLabelColor` |
| `image` | Image beside content | `image`, `side` (`left`/`right`), `backgroundSize`, `alt` (screen-reader text; empty = decorative) |
| `iframe` | Embedded page, full or beside content | `url`, `side` (`full`/`left`/`right`), `scale` (> 0, default 1), `title` (screen-reader name) |
| `quote`, `statement`, `fact` | Emphasis slides | `padding`, `contentMaxWidth` |
| `full` | No padding, build your own | |
| `full-text` | Full-width text, no pinned title | |
| `full-image` | Background image with overlay | `image`, `overlay`, `position` (or `backgroundPosition`), `backgroundSize`, `align`, `padding` |
| `full-split` | Background image with a text panel | `image`, `panelWidth`, `panelSide`, `panelColor`, `backgroundSize`, `backgroundPosition` |
| `full-dark` | Dark centered slide with a large heading | `padding`, `contentMaxWidth` |

Column slots:

```md
---
layout: two-cols
leftLabel: Before
rightLabel: After
divider: true
---

# Header

::left::
Left content

::right::
Right content

::bottom::
Full-width footer
```

`quote`: write the quote as a `>` blockquote and the attribution as the paragraph after it. The quote marks wrap the blockquote:

```md
---
layout: quote
---

> The best way to predict the future is to invent it.

**— Alan Kay, 1971**
```

Without a blockquote, a heading (`# "…"`) is the quote; otherwise the paragraphs before the last are the quote and the last is the attribution, and a single paragraph is a quote without one.

### Compatibility Aliases

Layout names from 1.x still work as presets of current layouts; frontmatter values override the preset:

| Alias | Equivalent |
|---|---|
| `image-left` / `image-right` | `image` + `side: left` / `right` |
| `iframe-left` / `iframe-right` | `iframe` + `side: left` / `right` |
| `two-cols-header` | `two-cols` |
| `comparison` | `two-cols` + `divider: true`, `leftLabel: Before`, `rightLabel: After` |
| `full-center` | `center` + `padding: 2rem` |

## Code Blocks

Code uses Slidev's own syntax; the theme styles it:

````md
```ts [src/kernel.ts] {2|3-4|all}{lines:true}
…
```
````

- **Title** (`[file.ts]`, and `::code-group` tabs): a window bar with macOS dots over the code. `--code-title-dots: none` hides the dots; `--code-title-bg`, `--code-title-color`.
- **Line numbers** (`lineNumbers: true` in the headmatter, or `{lines:true}` / `{lines:false}` on a block, `{startLine:10}`): `12 │ code`. `--code-ln-color`, `--code-ln-rule`.
- **Line focus** (`{2-3}`, or per click `{1|2-3|all}`): the other lines are dimmed (`--code-dim-opacity`, 0.45). `class: code-focus-tint` on a slide (or `themeConfig: { codeFocus: tint }` for the deck) dims nothing and tints the focused lines instead (`--code-focus-bg`).
- **Shell sessions**: in a `bash` / `sh` / `zsh` / `console` block with prompt lines (`$ cmd`, `% cmd`, or a themed prompt ending in `❯` / `➜`), the other lines are output, shown muted (`--code-output-color`). Use ```` ```bash [zsh] ```` for a terminal window; `tree` output works as a file tree.
- **Nerd Font icons** (powerline prompts and the like) render everywhere, exports included: the theme bundles the symbols-only Nerd Font (MIT), loaded only on slides that use one.
- **Long lines wrap** under their code, never a scrollbar. Code blocks have no height cap unless you set `--code-max-height` or Slidev's `{maxHeight:'…'}`; what doesn't fit is then cut off, not scrolled.

## Components

| Component | Props |
|---|---|
| `<Badge>` | `variant`: `default` `blue` `green` `red` `yellow` `cyan` `gray` |
| `<Kbd>` | |
| `<Footnote>` | (slot; pinned at the bottom of the slide) |
| `<LinkCard>` | `href`, `title`, `description`, `icon`, `compact` |
| `<FloatImage>` | `src`, `alt`, `caption`, `position` (`left`/`right`), `width`, `rounded` |
| `<StoryBox>` | `title`, `variant` (`history` `insight` `warning` `tip` `person`), `year`, `source`, `color`, `icon` |
| `<PatternCard>` | `signal`, `template`, `alternatives`, `sections` (`[{ key, label, icon, color, text }]`); same-named slots for rich content |
| `<Timeline>` | `items` (`[{ title, year, desc, color }]`), `active` |
| `<ComplexityTable>` | `title`, `rows` (`[{ n, target, algo, complexity, highlight }]`), `showComplexity` |
| `<Countdown>` | `minutes`, `size` (`sm` `default` `lg` `xl`), `label`, `autoStart`, `showZero` |
| `<QRCode>` | `url` (empty: this deck), `slide` (`true`: this slide, or a number), `size` (preset or any CSS length), `caption`, `ecc` (`L` / `M` / `Q` / `H`), `api` (`{data}`, `{size}` are replaced), `src` |
| `<PresenterNote>` | (slot; shown only in the presenter view) |

`<QRCode>` is generated in the browser, so it works offline and in exports, and the URL is not sent anywhere. It is also a link. Without `url` it points to this deck: `seoMeta.ogUrl` from the headmatter if set (set it, or an exported deck points to the local export server), otherwise the address it is served from, with `--base` and `routerMode` applied. `api` switches back to a QR image service.

Text in `ComplexityTable`, `PatternCard`, `Timeline` and `StoryBox` props supports `$...$` math (KaTeX) and `x^y` superscripts; write `\$` for a literal dollar sign.

### Stage indicator

```yaml
---
stages: ["Concept", "Implementation", "Practice"]
currentStage: 1
stagePosition: top     # top | top-left | top-right | bottom | left | right
---
```

Click a stage to jump to the matching slide (or give `stageMap: [3, 7, 12]`).

## CSS Classes

| Class | |
|---|---|
| `.card` | Card container with hover lift |
| `.alert` + `.alert-info` / `-success` / `-warning` / `-error` | Callouts |
| `.gradient-text`, `.gradient-text-1` / `-2` / `-3` | Gradient text |
| `.gradient-card` | Card with a gradient bar on top |
| `.gradient-border` | Gradient outline |
| `.glass-gradient` | Frosted glass card |
| `.btn-macos` (+ `-primary` `-secondary` `-destructive` `-success`, `-small` `-regular` `-large`, `-rounded` `-capsule`, `-icon`, `-toolbar`, `-loading`), `.btn-macos-group` | macOS-style buttons |
| `.macos-traffic-lights` / `.macos-traffic-light` | Window dots |
| `.table-compact`, `.table-dense`, `.table-auto`, `.table-square` | Table variants (on the table or a wrapper) |

## Progress Bar, Page Number & Footer

Set deck-wide options in the headmatter; a slide's own `progressBar` / `pageNumber` / `footer` overrides it for that slide.

```yaml
---
progressBar: content          # always (default) | content | false
progressBarSkip: 2, 5-6       # pages without the bar (list, ranges, or an array)
progressBarSkipMode: exclude  # hide (default): only hide the bar
                              # exclude: also leave skipped pages out of the progress
pageNumber: false             # hide the page number (default: shown, except on title slides and section dividers)

# Exports only (PDF / PNG / ?print); the presentation is unchanged
progressBarInExport: false
pageNumberInExport: false
footerInExport: false
---
```

### Talk details: cover and footer

Write the talk's details once in the headmatter. The first slide's `cover` shows them under the title, and the footer line can show them on content slides:

```yaml
---
title: CUDA Memory Optimization
author: Jane Doe              # one name (Slidev also puts it in the PDF/PPTX metadata)
# authors:                    # several people: names or { name, affiliation }
#   - { name: Jane Doe, affiliation: GPU Team }
#   - Alex Kim
affiliation: GPU Team, ACME
event: GTC 2026
date: '2026-10-09'            # quote "2026.10": YAML reads it as a number
logo: /logo.svg               # from public/; crop it without padding
footer: true                  # show them at the bottom left (off by default)
# footer: [title, event]      # or pick the ones you want, in this order
---
```

- **Cover**: the first slide shows the details that are set; `coverInfo: false` turns them off there. Another `cover` slide shows them only with `coverInfo: true`, and its own `author` / `authors` / `affiliation` / `event` / `date` / `logo` replace the deck's (a cover with its own people leaves out the deck's `affiliation` unless it sets one).
- **Footer**: `footer: true` shows title · author · event · date and the logo (those that are set); a list picks them in its order (`logo` and `affiliation` too). The page number stays at the bottom right, and a long line ends in "…" before it. Like the page number, it is hidden on title slides and section dividers.
- A slide's own `footer` replaces the deck's for that slide: `false` hides it, and `true` or a list shows it, so a slide can have a footer even when the deck has none. A `<Footnote>` on the slide moves up above the footer line (and above a bottom stage indicator).

## Customization

Every value below defaults to the theme's look.

**Where to set a variable**

- **Anywhere** (inline `style`, a wrapper element, or `:root` in your `styles/index.css`): all variables listed below, except the ones in the next point.
- **On the element** (inline `style`) for component colors that a variant already sets: `--badge-color`, `--story-color`, `--pattern-color`. Prefer the props (`variant`, `color`, `sections`).
- Effect classes like `anim-border-ocean` or `anim-shimmer-slow` set their variables on the element, so an inline value on that element wins over them.

```html
<div class="anim-border" style="--ab-c1: #ff6b6b; --ab-duration: 3s">…</div>
```

```css
/* styles/index.css in your deck */
:root {
  --hover-lift: 8px;
  --glow-intensity: 0.5;
  --table-radius: 0;
}
```

### Slides

| | Variables |
|---|---|
| Content slides | `--slide-padding`, `--slide-padding-x`, `--slide-title-top`, `--slide-font-size` |
| Emphasis layouts | `--quote-mark-size`, `--quote-size`, `--statement-size`, `--fact-size`, `--full-text-padding` |
| Code blocks, images | `--code-max-height`, `--image-max-height` (none by default; code that doesn't fit is cut off, never scrolled) |
| Utility guards | `--grid-padding-x` (2rem side padding on `grid` inside slides), `--flex-wrap` (`flex` wraps by default), `--absolute-max-width` |
| Slide transitions | `--slide-transition-duration` |
| Progress bar / page number | `--progress-height`, `--progress-color`, `--progress-track`, `--progress-glow`, `--page-number-size`, `--page-number-color`, `--page-number-right`, `--page-number-bottom` |
| Cover details | `--cover-info-color`, `--cover-info-muted`, `--cover-logo-height` |
| Footer line | `--footer-size`, `--footer-color`, `--footer-left`, `--footer-bottom`, `--footer-logo-height`; `--footnote-bottom-with-footer`, `--footnote-bottom-with-stage` (where a `<Footnote>` goes then) |
| Stage indicator | `--stage-done-color`, `--stage-active-color`, `--stage-upcoming-color`, `--stage-dot-size`, `--stage-font-size` |

### Components

| | Variables |
|---|---|
| `<Badge>` | `--badge-color` |
| `<Kbd>`, gray badge | `--key-bg` (light mode: `--light-key-bg`) |
| `<StoryBox>` | `--story-color`, `--story-padding`, `--story-radius` |
| `<PatternCard>` | `--pattern-color` |
| `<Timeline>` | `--tl-dot-color`, `--tl-active-color`, `--tl-line-color`, `--tl-year-color` |
| `<Footnote>` | `--footnote-size`, `--footnote-bottom`, `--footnote-left`, `--footnote-right` |
| `<Countdown>` | `--countdown-size`, `--countdown-color` |
| `<QRCode>` | `--qrcode-size` |
| Tables, `<ComplexityTable>` | `--table-radius` (or `.table-square`) |
| `.card` | `--card-radius`, `--card-padding`, `--card-margin`, `--card-hover-lift` |
| `.alert` | `--alert-padding`, `--alert-margin`, `--alert-radius`, `--alert-border-width` |
| `.btn-macos` | `--macos-radius`, `--macos-font-size`, `--macos-padding`, `--macos-height` |

### Animations

| Effect | Variables | Presets |
|---|---|---|
| Entrances (`anim-fade-in`, `anim-fade-up`, `anim-fade-left`, `anim-fade-right`, `anim-pop`) | `--anim-duration`, `--anim-distance`, `--anim-delay`, `--pop-scale` | `anim-delay-1` … `-5` |
| `anim-float`, `anim-cursor` | `--float-distance`, `--float-duration`, `--cursor-color`, `--cursor-duration` | |
| `anim-border` | `--ab-c1`, `--ab-c2`, `--ab-c3`, `--ab-dim`, `--ab-len`, `--ab-duration` (`s` or `ms`) | colors `-ocean` `-sunset` `-neon` `-ice` `-fire` `-mint` `-gold`; `-slow` `-fast` `-ccw` |
| `anim-shimmer` | `--shimmer-color`, `--shimmer-width`, `--shimmer-travel`, `--shimmer-duration` | directions `-right` `-down` `-up` `-diag`; colors `-purple` `-blue` `-green` `-warm` `-neon`; `-slow` `-fast` |
| `anim-glow` | `--glow` (any color), `--glow-intensity`, `--glow-duration` | colors `-purple` `-blue` `-green` `-red` `-cyan` `-gold` `-neon`; `-slow` `-fast` |
| `anim-gradient-text` | `--gt-c1` … `--gt-c5`, `--gt-period`, `--gt-duration` | `-ocean` `-sunset` `-fire` `-neon`; `-slow` `-fast` |
| `hover-lift` / `-scale` / `-tilt` / `-glow` / `-border` / `-gradient` / `-shine` | `--hover-duration`, `--hover-lift`, `--hover-scale`, `--hover-tilt-x`, `--hover-tilt-y`, `--hover-glow`, `--hover-border-c1` / `-c2`, `--hover-gradient-c1` / `-c2`, `--hover-shine-color`, `--hover-shine-width` | `hover-glow-blue`, `hover-glow-green` |
| Slide transitions (`transition:` frontmatter) | `--slide-transition-duration` | `slide-left` `slide-right` `slide-up` `fade` `scale-fade` `blur-fade` |

The animated border light runs at a constant speed along the border (a small script). All animations respect `prefers-reduced-motion`.

**In PDF / PNG exports** each effect is a still picture: a static gradient ring for `anim-border`, a steady glow for `anim-glow`, no shimmer band, entrance animations finished; `Countdown` and `PresenterNote` are left out. Gradient text, border rings and shadows are drawn as images there, because PDF viewers (macOS Preview in particular) draw the CSS versions wrongly; the text stays searchable. To style exports yourself, use the `html.print-mode` class (set for `slidev export`, the export page and browser printing), not `@media print` — `slidev export` renders with screen media.

## Colors

One Dark accents with a purple → blue gradient:

| Token | Dark mode | Light mode | Override light |
|---|---|---|---|
| `--one-dark-blue` | `#61afef` | `#1f6fb2` | `--light-blue` |
| `--one-dark-magenta` / `--primary-400` | `#c678dd` | `#9b3fb8` | `--light-magenta` / `--light-primary` |
| `--one-dark-green` | `#98c379` | `#3d7a1f` | `--light-green` |
| `--one-dark-yellow` | `#e5c07b` | `#8a6200` | `--light-yellow` |
| `--one-dark-red` | `#e06c75` | `#b8323f` | `--light-red` |
| `--one-dark-cyan` | `#56b6c2` | `#157a87` | `--light-cyan` |
| `--text-primary` / `--text-muted` | `#c0c6d0` / `#858c98` | `#1a1d23` / `#6b7280` | `--light-text-primary` / `--light-text-muted` |

Light-mode accents are deeper so text stays readable (≥ 4.5:1) on white.

### Brand colors

Set your brand color in the headmatter and the theme derives the rest:

```yaml
---
theme: one-purple-unicorn-pro
themeConfig:
  primary: '#0ea5e9'     # quote it: an unquoted # starts a YAML comment
  secondary: '#a78bfa'   # optional; by default a partner picked from primary
  accents:               # optional: blue, cyan, green, yellow, red
    green: '#22c55e'
---
```

- **`primary`** colors titles, headings, links, list markers, glows, the progress bar and the cover gradient. It derives the whole `--primary-100`…`--primary-900` scale and the light-mode shades.
- **`secondary`** is the gradient partner and `h3` color. Left out, it is picked from `primary`: a quarter turn back on the color wheel, a little lighter and softer (blue gets teal, orange gets pink).
- **`accents`** replace the One Dark accents. Their light-mode shades and, for blue / green / yellow / red, the info / success / warning / error alert tints follow.

Light-mode shades are deepened until they reach 4.5:1 on white. Colors are hex (`#rgb` or `#rrggbb`); anything else is ignored with a console warning. Code highlighting and neutral colors stay as they are.

To set a single token instead, put it and its light counterpart on `:root`:

```css
:root {
  --primary-400: #a855f7;     /* dark mode */
  --light-primary: #7e22ce;   /* light mode */
  --secondary-400: #2dd4bf;   /* gradient partner, h3 (dark mode) */
  --light-secondary: #0f766e; /* its light-mode shade */
}
```

## Development

Working on the theme itself needs Node 24 and npm 12 (checked through `devEngines`). Run `scripts/bootstrap.sh` once, then `cd example && npm run dev`. See [DEV.md](DEV.md) (Korean) for the workflow, conventions and release steps.

## License

[MIT](LICENSE)
