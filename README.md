# One Purple Unicorn Pro - Slidev Theme

A Slidev theme with purple → blue gradients and One Dark colors, built for technical talks.

## Features

- **Light & dark modes**: content slides switch palettes; title and emphasis slides stay dark
- **Korean + English**: Noto Sans KR by default, any font via `fonts:`
- **Layouts**: title, columns, image/iframe, quote/statement/fact, full-bleed
- **Components**: badges, keys, footnotes, link cards, story boxes, pattern cards, complexity tables (with KaTeX), timelines, countdown, QR codes
- **Effects**: animated borders, shimmer, glow, gradient text, entrance animations, hover effects
- **Code**: custom One Dark-based Shiki theme (incl. CUDA/C++ keywords)
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
| `cover`, `intro`, `section`, `end` | Title slides | `padding`, `contentMaxWidth` (`intro`: also `align`, default `left`) |
| `default` | Content slide (title pinned at the top) | |
| `center` | Centered content | `padding`, `contentMaxWidth` |
| `two-cols`, `three-cols` | Columns with a header (default slot) and a `bottom` slot | `leftWidth`, `centerWidth`, `rightWidth`, `divider`, `leftLabel`, `centerLabel`, `rightLabel`, `leftLabelColor`, `centerLabelColor`, `rightLabelColor` |
| `image` | Image beside content | `image`, `side` (`left`/`right`), `backgroundSize` |
| `iframe` | Embedded page, full or beside content | `url`, `side` (`full`/`left`/`right`), `scale` |
| `quote`, `statement`, `fact` | Emphasis slides | `padding`, `contentMaxWidth` |
| `full` | No padding, build your own | |
| `full-text` | Full-width text, no pinned title | |
| `full-image` | Background image with overlay | `image`, `overlay`, `position`, `backgroundSize`, `align`, `padding` |
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

`quote`: the quote text paragraphs, then a last paragraph as the attribution (`**— Name**`).

### Compatibility Aliases

Layout names from 1.x still work as presets of current layouts; frontmatter values override the preset:

| Alias | Equivalent |
|---|---|
| `image-left` / `image-right` | `image` + `side: left` / `right` |
| `iframe-left` / `iframe-right` | `iframe` + `side: left` / `right` |
| `two-cols-header` | `two-cols` |
| `comparison` | `two-cols` + `divider: true`, `leftLabel: Before`, `rightLabel: After` |
| `full-center` | `center` + `padding: 2rem` |

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
| `<QRCode>` | `url`, `size` (preset or any CSS length), `caption`, `api` (`{data}` is replaced), `src` |
| `<PresenterNote>` | (slot; shown only in the presenter view) |

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

## Progress Bar & Page Number

Set deck-wide options in the headmatter; a slide's own `progressBar` / `pageNumber` overrides it for that slide.

```yaml
---
progressBar: content          # always (default) | content | false
progressBarSkip: 2, 5-6       # pages without the bar (list, ranges, or an array)
progressBarSkipMode: exclude  # hide (default): only hide the bar
                              # exclude: also leave skipped pages out of the progress
pageNumber: false             # hide the page number (default: shown, except on title slides)

# Exports only (PDF / PNG / ?print); the presentation is unchanged
progressBarInExport: false
pageNumberInExport: false
---
```

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
| Utility guards | `--grid-padding-x` (2rem side padding on `grid` inside slides), `--flex-wrap` (`flex` wraps by default), `--absolute-max-width` |
| Slide transitions | `--slide-transition-duration` |
| Progress bar / page number | `--progress-height`, `--progress-color`, `--progress-track`, `--progress-glow`, `--page-number-size`, `--page-number-color`, `--page-number-right`, `--page-number-bottom` |
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
| Entrances (`anim-fade-in` / `-up` / `-left` / `-right`, `anim-pop`) | `--anim-duration`, `--anim-distance`, `--anim-delay`, `--pop-scale` | `anim-delay-1` … `-5` |
| `anim-float`, `anim-cursor` | `--float-distance`, `--float-duration`, `--cursor-color`, `--cursor-duration` | |
| `anim-border` | `--ab-c1`, `--ab-c2`, `--ab-c3`, `--ab-dim`, `--ab-len`, `--ab-duration` (`s` or `ms`) | colors `-ocean` `-sunset` `-neon` `-ice` `-fire` `-mint` `-gold`; `-slow` `-fast` `-ccw` |
| `anim-shimmer` | `--shimmer-color`, `--shimmer-width`, `--shimmer-travel`, `--shimmer-duration` | directions `-right` `-down` `-up` `-diag`; colors `-purple` `-blue` `-green` `-warm` `-neon`; `-slow` `-fast` |
| `anim-glow` | `--glow` (any color), `--glow-intensity`, `--glow-duration` | colors `-purple` `-blue` `-green` `-red` `-cyan` `-gold` `-neon`; `-slow` `-fast` |
| `anim-gradient-text` | `--gt-c1` … `--gt-c5`, `--gt-period`, `--gt-duration` | `-ocean` `-sunset` `-fire` `-neon`; `-slow` `-fast` |
| `hover-lift` / `-scale` / `-tilt` / `-glow` / `-border` / `-gradient` / `-shine` | `--hover-duration`, `--hover-lift`, `--hover-scale`, `--hover-tilt-x`, `--hover-tilt-y`, `--hover-glow`, `--hover-border-c1` / `-c2`, `--hover-gradient-c1` / `-c2`, `--hover-shine-color`, `--hover-shine-width` | `hover-glow-blue`, `hover-glow-green` |
| Slide transitions (`transition:` frontmatter) | `--slide-transition-duration` | `slide-left` `slide-right` `slide-up` `fade` `scale-fade` `blur-fade` |

The animated border light runs at a constant speed along the border (a small script); exports and print show a static gradient ring. All animations respect `prefers-reduced-motion`.

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

Light-mode accents are deeper so text stays readable (≥ 4.5:1) on white. To recolor, set the dark-mode tokens and their light counterparts on `:root`:

```css
:root {
  --primary-400: #a855f7;   /* dark mode */
  --light-primary: #7e22ce; /* light mode */
}
```

## License

[MIT](LICENSE)
