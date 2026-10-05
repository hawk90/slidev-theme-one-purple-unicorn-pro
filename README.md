# One Purple Unicorn Pro - Slidev Theme

A professional Slidev theme with purple and indigo gradients, optimized for technical presentations.

## Features

- **Purple & Indigo Color Scheme**: Beautiful gradient effects from purple to blue
- **Light & Dark Modes**: User-configurable theme switching
- **Korean + English Support**: Noto Sans KR font for mixed language presentations
- **Clean Layouts**: Special layouts for cover, intro, section, and end slides
- **Code Highlighting**: Custom One Dark-based Shiki theme (incl. CUDA/C++ keywords)
- **Components & Effects**: callouts, pattern cards, complexity tables (with KaTeX), timelines, animated borders, shimmer, hover effects — all customizable

## Installation

```bash
npm install slidev-theme-one-purple-unicorn-pro
```

## Usage

Add the theme to your Slidev presentation:

```yaml
---
theme: slidev-theme-one-purple-unicorn-pro
colorSchema: light  # or 'dark', 'auto'
---

# Your Presentation Title
```

## Theme Modes

Set the color mode for the whole deck in the headmatter (Slidev applies it deck-wide):

```yaml
---
colorSchema: auto   # auto (default, follows the system / toggle) | light | dark
---
```

Content slides switch between light and dark palettes. Title and emphasis layouts (`cover`, `intro`, `section`, `end`, `quote`, `statement`, `fact`, `full-*`) stay dark in both modes; code blocks always use the dark code theme.

## Available Layouts

### Cover Layout
```yaml
---
layout: cover
---

# Your Title
Subtitle or description
```

### Section Layout
```yaml
---
layout: section
---

# Section Title
```

### Intro Layout
```yaml
---
layout: intro
---

# Introduction
Your intro content here
```

### End Layout
```yaml
---
layout: end
---

# Thank You
Contact information
```

### Two Columns Layout
```yaml
---
layout: two-cols
---

# Two Column Layout

::left::

Left column content

::right::

Right column content
```

### Compatibility Aliases

Layout names from 1.x still work. Each one is a preset of a current layout, and frontmatter values override the preset:

| Alias | Equivalent |
|---|---|
| `image-left` / `image-right` | `layout: image` + `side: left` / `right` |
| `iframe-left` / `iframe-right` | `layout: iframe` + `side: left` / `right` |
| `two-cols-header` | `layout: two-cols` |
| `comparison` | `layout: two-cols` + `divider: true`, `leftLabel: Before`, `rightLabel: After` |
| `full-center` | `layout: center` + `padding: 2rem` |
| `full-dark` | Dark centered slide with a large heading (similar to `statement`) |

## Progress Bar

Set deck-wide options in the headmatter; a slide's own `progressBar` overrides it for that slide.

```yaml
---
progressBar: content          # always (default) | content | false
progressBarSkip: 2, 5-6       # pages without the bar (list, ranges, or an array)
progressBarSkipMode: exclude  # hide (default): only hide the bar
                              # exclude: also leave skipped pages out of the progress
---
```

## Customization

Every value below defaults to the theme's look. CSS variables can be set inline (`style="--card-radius: 0"`), on a wrapper, or globally in a `<style>` block; props go in the layout frontmatter or on the component.

### Layouts (frontmatter)

| Layout | Options |
|---|---|
| `cover`, `intro`, `section`, `end`, `quote`, `statement`, `fact`, `full-dark`, `center` | `padding`, `contentMaxWidth` (`intro` also `align`) |
| `two-cols` / `three-cols` | `leftWidth`, `centerWidth`, `rightWidth`, `divider`, `leftLabel`, `centerLabel`, `rightLabel`, `leftLabelColor`, `centerLabelColor`, `rightLabelColor` |
| `image` / `iframe` | `image` / `url`, `side`, `backgroundSize`, `scale` |
| `full-image` | `image`, `overlay`, `position`, `backgroundSize`, `align`, `padding` |
| `full-split` | `image`, `panelWidth`, `panelSide`, `panelColor`, `backgroundSize`, `backgroundPosition` |

Content slides: `--slide-padding`, `--slide-padding-x`, `--slide-title-top`, `--slide-font-size`. Emphasis text: `--quote-mark-size`, `--quote-size`, `--statement-size`, `--fact-size`, `--full-text-padding`.

### Components

| Component | Props | CSS variables |
|---|---|---|
| `<Badge>` | `variant` | `--badge-color` |
| `<StoryBox>` | `variant`, `title`, `year`, `source`, `color`, `icon` | `--story-color`, `--story-padding`, `--story-radius` |
| `<PatternCard>` | `signal`, `template`, `alternatives`, `sections` (`[{ key, label, icon, color, text }]`) | `--pattern-color` |
| `<Timeline>` | `items` (`{ title, year, desc, color }`), `active` | `--tl-dot-color`, `--tl-active-color`, `--tl-line-color`, `--tl-year-color` |
| `<ComplexityTable>` | `title`, `rows`, `showComplexity` | `--table-radius` |
| `<Footnote>` | | `--footnote-size`, `--footnote-bottom`, `--footnote-left`, `--footnote-right` |
| `<Countdown>` | `minutes`, `size`, `label`, `autoStart`, `showZero` | `--countdown-size`, `--countdown-color` |
| `<QRCode>` | `url`, `size` (preset or CSS length), `caption`, `api` (`{data}` placeholder), `src` | `--qrcode-size` |
| `<Kbd>` | | `--key-bg` |
| Stage indicator | `stages`, `currentStage`, `stagePosition`, `stageMap` (frontmatter) | `--stage-done-color`, `--stage-active-color`, `--stage-upcoming-color`, `--stage-dot-size`, `--stage-font-size` |

Text in `ComplexityTable`, `PatternCard`, `Timeline` and `StoryBox` props supports `$...$` math (KaTeX) and `x^y` superscripts.

### Tables, cards, chrome

- Tables: `--table-radius` (or `.table-square`)
- `.card`: `--card-radius`, `--card-padding`, `--card-margin`, `--card-hover-lift`
- `.alert`: `--alert-padding`, `--alert-margin`, `--alert-radius`, `--alert-border-width`
- `.btn-macos`: `--macos-radius`, `--macos-font-size`, `--macos-padding`, `--macos-height`
- Progress bar / page number: `--progress-height`, `--progress-color`, `--progress-track`, `--progress-glow`, `--page-number-size`, `--page-number-color`, `--page-number-right`, `--page-number-bottom`

### Animations

| Effect | Variables |
|---|---|
| Entrances (`anim-fade-*`, `anim-pop`) | `--anim-duration`, `--anim-distance`, `--anim-delay` (presets `anim-delay-1..5`), `--pop-scale` |
| `anim-float` / `anim-cursor` | `--float-distance`, `--float-duration` / `--cursor-color`, `--cursor-duration` |
| `anim-border` | `--ab-c1`, `--ab-c2`, `--ab-c3`, `--ab-dim`, `--ab-len`, `--ab-duration` |
| `anim-shimmer` | `--shimmer-color`, `--shimmer-width`, `--shimmer-travel`, `--shimmer-duration` |
| `anim-glow` | `--glow`, `--glow-intensity`, `--glow-duration` |
| `anim-gradient-text` | `--gt-c1` … `--gt-c5`, `--gt-period`, `--gt-duration` |
| Hover (`hover-*`) | `--hover-duration`, `--hover-lift`, `--hover-scale`, `--hover-tilt-x`, `--hover-tilt-y`, `--hover-glow`, `--hover-border-c1/-c2`, `--hover-gradient-c1/-c2`, `--hover-shine-color`, `--hover-shine-width` |

## Color Palette

One Dark accents with a purple → blue gradient:

| Token | Dark mode | Light mode |
|---|---|---|
| `--one-dark-blue` | `#61afef` | `#1f6fb2` |
| `--one-dark-magenta` / `--primary-400` | `#c678dd` | `#9b3fb8` |
| `--one-dark-green` | `#98c379` | `#3d7a1f` |
| `--one-dark-yellow` | `#e5c07b` | `#8a6200` |
| `--one-dark-red` | `#e06c75` | `#b8323f` |
| `--one-dark-cyan` | `#56b6c2` | `#157a87` |
| `--text-primary` / `--text-muted` | `#c0c6d0` / `#858c98` | `#1a1d23` / `#6b7280` |

Light-mode accents are deeper so text stays readable (≥ 4.5:1) on white.

## Typography

- **Sans**: Noto Sans KR, Inter, system-ui
- **Mono**: JetBrains Mono, Fira Code
- **Serif**: Noto Serif KR

## Overriding Colors

Theme colors are CSS variables, so a deck can override them in a global style (e.g. `styles/index.css` in your project):

```css
:root {
  --primary-400: #a855f7;
  --one-dark-blue: #3b82f6;
}
```

See [Customization](#customization) for per-component and per-effect variables.

## License

MIT