# One Purple Unicorn Pro - Slidev Theme

A Slidev theme with purple → blue gradients and One Dark colors, built for technical talks.

## Features

- **Light & dark modes**: content slides switch palettes; title and emphasis slides stay dark
- **Korean + English**: Noto Sans KR by default, any font via `fonts:`; Korean text breaks between words (`keep-all`), headings balance their lines, full-width opening punctuation starts flush; `hangul` / `hangul-consonant` / `circled` list counters (on an `ol` or a wrapper: 가 나 다, ㄱ ㄴ ㄷ, ① ② ③); `<span class="bilingual">English</span>` after a title keeps a second-language title in one piece, smaller
- **Layouts**: title, columns, image/iframe, quote/statement/fact, full-bleed
- **Components**: badges, keys, footnotes, link cards, story boxes, pattern cards, complexity tables (with KaTeX), stats, timelines, countdown, QR codes
- **Effects**: animated borders, shimmer, glow, gradient text, entrance animations, hover effects
- **Code**: custom One Dark-based Shiki theme (incl. CUDA/C++ keywords), window title bars, line numbers, line focus, shell sessions, Nerd Font icons; long lines wrap (never a scrollbar)
- **Customizable**: every size, color and speed has a default and a variable or prop

## Installation

```bash
npm install slidev-theme-one-purple-unicorn-pro
```

Requires Slidev 53 or later (Node 22.12+).

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

Content slides switch between light and dark palettes. These layouts stay dark in both modes: `cover`, `intro`, `section`, `end`, `quote`, `statement`, `fact`, `full-image`, `full-split`, `full-dark`. Any other slide can stay dark too with `class: slide-dark`; the progress bar, footer, page number and stage indicator over it follow. Code blocks always use the dark code theme.

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
| `cover`, `intro`, `section`, `end` | Title slides | `padding`, `contentMaxWidth` (`intro`: also `align`, default `left`; `cover`: the talk's details, see [Talk details](#talk-details-cover-and-footer); `end`: `questions: true` adds a QR code to the deck (`qr:` another URL, or `false`; `qrCaption`) and the `contact` links, the slide's or the headmatter's) |
| `default` | Content slide (title pinned at the top) | |
| `exercise` | An exercise or lab: number and time in a tag at the top, the task (the slide's content), and beside it how to work, what to expect and a countdown (it waits for its start button) | `exercise` (a number or a label), `time` (`15min`, `1h`, or minutes), `method`, `expected`, `countdown: false` |
| `speaker` | About the speaker: the person (avatar or initials, name, role, affiliation, links) beside the slide's text | `speaker:` with `name`, `role`, `affiliation`, `avatar`, `links` (on the slide or in the headmatter; else the deck's `author`) |
| `center` | Centered content | `padding`, `contentMaxWidth` |
| `two-cols`, `three-cols` | Columns with a header (default slot) and a `bottom` slot | `leftWidth`, `centerWidth`, `rightWidth` (a bare number is a share, `2` → `2fr`; anything else a CSS length), `divider`, `leftLabel`, `centerLabel`, `rightLabel`, `leftLabelColor`, `centerLabelColor`, `rightLabelColor` |
| `image` | Image or video beside content | `image` (a picture or a video, `.mp4` / `.webm`; or a list of up to three, tiled), `side` (`left`/`right`), `imageWidth` (the media column: `50%` by default; `40%`, `0.4`, `2/5`, `30rem`), `imageStack` (`row` / `column` for several), `poster` (a video's picture before it plays and in exports), `backgroundSize`, `alt` (screen-reader text; empty = decorative) |
| `iframe` | Embedded page, full or beside content | `url`, `side` (`full`/`left`/`right`), `scale` (> 0, default 1), `iframeTitle` (screen-reader name) |
| `quote`, `statement`, `fact` | Emphasis slides | `padding`, `contentMaxWidth` |
| `full` | No padding, build your own | |
| `full-text` | Full-width text, no pinned title | |
| `full-image` | Background image or video with overlay | `image` (as in `image`: a video or up to three tiled), `imageStack`, `poster`, `overlay`, `position` (or `backgroundPosition`), `backgroundSize`, `align`, `padding` |
| `full-split` | Background image or video with a text panel | `image` (a video or up to three tiled), `imageStack`, `poster`, `panelWidth`, `panelSide`, `panelColor`, `backgroundSize`, `backgroundPosition` |
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
Full-width bottom slot
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

## Code Blocks

Code uses Slidev's own syntax; the theme styles it:

````md
```ts [src/kernel.ts] {2|3-4|all}{lines:true}
…
```
````

- **Title** (`[file.ts]`, and `::code-group` tabs): a window bar with macOS dots over the code. `--code-title-dots: none` hides the dots; `--code-title-bg`, `--code-title-color`. `::code-group` is MDC syntax: it needs `mdc: true` in the headmatter, or Slidev prints `::code-group` as text and stacks the blocks. With `mdc: true`, Slidev currently shows a stray "x" in checked task-list items (`- [x] Done`; [slidevjs/slidev#2568](https://github.com/slidevjs/slidev/issues/2568)).
- **Line numbers** (`lineNumbers: true` in the headmatter, or `{lines:true}` / `{lines:false}` on a block, `{startLine:10}`): `12 │ code`. `--code-ln-width` (3ch; 4ch for numbers from 1000), `--code-ln-color`, `--code-ln-rule`.
- **Line focus** (`{2-3}`, or per click `{1|2-3|all}`): the other lines are dimmed (`--code-dim-opacity`, 0.45). `class: code-focus-tint` on a slide (or `themeConfig: { codeFocus: tint }` for the deck) dims nothing and tints the focused lines instead (`--code-focus-bg`).
- **Shell sessions**: in a `bash` / `sh` / `shell` / `shellscript` / `zsh` / `fish` / `console` / `shellsession` block with prompt lines (`$ cmd`, `% cmd`, or a themed prompt ending in `❯` / `➜`, starting at the line's start), the other lines are output, shown muted (`--code-output-color`). A command goes on in the next lines after a trailing `\`, `|`, `&&` or `||`, inside `for … done`, `if … fi`, `case … esac` and `{ … }`, and through a heredoc (`<<EOF` … `EOF`), with or without the shell's `> `. In a block whose first prompt is `$` or `%`, a `❯` / `➜` later in a line is output. Root `#`, `>>>` and `PS>` prompts are not recognized. Use ```` ```bash [zsh] ```` for a terminal window.
- **Nerd Font icons** (powerline prompts and the like) render in code blocks, exports included: the theme bundles the symbols-only Nerd Font (MIT), fetched only on slides that show one. Not in Monaco or inline code.
- **Long lines wrap** under their code (a tab-stop hang), never a scrollbar. Code blocks have no height cap unless you set `--code-max-height` (what doesn't fit is cut off) or Slidev's `{maxHeight:'…'}` (it scrolls to the focused lines, with no scrollbar). Magic-move blocks have no line boxes: their long lines wrap to the left edge, without the gutter rule.
- Lines over 2000 characters (minified code, base64) are left uncolored, which keeps builds fast.
- **Mermaid**: diagrams in the theme's colors (nodes in the accent, notes yellow, lines in the text color), following light mode, dark slides and a `themeConfig` palette without redrawing; the classic `dagre` layout. Variables: `--mermaid-node-bg`, `--mermaid-node-border`, `--mermaid-text`, `--mermaid-line`, `--mermaid-cluster-bg`, `--mermaid-note-bg`. A deck's own `setup/mermaid.ts` still applies on top.
- **Walls** (`LogoWall`, `TeamGrid`, `PhotoWall`) arrange themselves by count: 1–4 in one row, 5–6 in 3 columns, 7–8 in 4, 9 in 3, 10–12 in 4; `columns` sets it.
- **Links** (`links`, `contact`): a list of URLs, e-mail addresses, `{ label, url }` or `{ github: name }` (`gitlab`, `x`, `linkedin`, `bluesky`, `mastodon: '@me@host'`, `web`, `email`), each shown with what it is.
- **GitHub alerts**: Slidev's `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]` take the `.alert` look (the same `--alert-*` variables) in the palette's colors, with the type's icon and name; left-aligned on centered layouts too.
- **Slidev's built-ins**: `v-mark` draws in the accent, and its color modifiers (`v-mark.red`, `.yellow`, …) take the theme's palette; a `highlight` mark is translucent so the text shows through (`--v-mark-color`, `--v-mark-highlight-opacity`). Twoslash popups and `{monaco-run}` output use the code block's colors.
- **Shrink to fit**: `fit: true` on a slide (or in the headmatter for every slide; a slide's `fit: false` wins) shrinks its content until it fits above the footer line, never below 0.42×; the title stays its size. A display formula wider than its box gets a smaller font too. Still too tall at 0.42×, the slide is marked `data-fit-overflow` and the console names it: split it. Exports fit each page the same way. Skipped on a slide with its own `zoom:` and when `slidev-addon-autofit` is in the deck's addons.
- **Compiler Explorer links**: `playground: true` in the headmatter (or a list: `playground: [cuda, python]`) adds a quiet **Compiler Explorer ↗** link at the bottom right of each code block in those languages (CUDA, C++, C, Python, Rust, Go, Zig, Swift, Kotlin, Java); it opens the block there with the language set, ready to compile (PTX/SASS for CUDA). A link, not a runner. A slide's own `playground` replaces the deck's there (`false` for none, `true` on one slide only). Not in exports.
- **Snippets by line range or content**: Slidev's `<<< @/code/kernel.cu` takes a whole file or a `#region`; with brackets the theme takes part of it, so example files need no region markers and stay compilable: `<<< @/code/kernel.cu[9-15]` (also `[9-]`, `[9]`) or `<<< ./reduce.cu[/__global__/,/^}/]` (from the first line matching the first pattern to the next matching the second). The lines are dedented and the window is titled `kernel.cu:9-15` (a `[title]` of your own wins); a language, `{2|3}` highlights and options follow as usual. When the file is in a git repository on GitHub, GitLab or Bitbucket, a link under the block opens those lines there, on the upstream's branch or the remote's default (`snippetBranch:` names another; `snippetLinks: false` drops the links). A missing file or a range that matches nothing shows as a warning on the slide.
- **Inline diagnostics**: a comment at the end of a line, `// [!code error: message]` (or `warning`, `info`), marks it as an editor would: a squiggle under an error, a tint on a warning or info line, the message after the code; `// [!code value: 42]` adds a muted `= 42`. `// [!code fold: includes]` on a line folds it and the lines above into one row (`⋯ includes · 3 lines`); line numbers and line-highlight ranges still count the folded lines. Any line comment works (`//`, `#`, `--`, `;`). Colors: `--diag-error`, `--diag-warning`, `--diag-info`.
- **Code across slides**: with Slidev's `transition: view-transition` on a slide (or the deck), its code windows carry over to the next slide: the first window moves and resizes into the next slide's first, the second into the second, while the code crossfades. Blocks, code groups and `<ClickTabs>` count as windows; the timing is Slidev's `magicMoveDuration` (800 ms). Browsers without view transitions fall back to Slidev's normal transition.
- **Prose, step by step**: a ```` ```quote ```` or ```` ```prose ```` fence is text, not code: the slide's own type, no window (`quote` with a blockquote's bar and italics). It takes the line-highlight clicks of code, ```` ```quote {1|2|3|all} ````, the lines not lit dimmed (`--prose-dim-opacity`, 0.3). Size: `--prose-size` (1.15rem; 1.3rem for `quote`).
- **CUDA**: write ```` ```cpp ````, or ```` ```cuda ```` / ```` ```cu ```` / ```` ```cuh ```` as GitHub and Pygments name it; they highlight the same (Shiki has no CUDA grammar, so the theme maps them to C++). CUDA names (`__global__`, `threadIdx`, `<<<…>>>` launches, `cudaMalloc`…) are colored in any language.
- The theme's `setup/shiki.ts` adds the CUDA and shell transformers and the `cuda` / `cu` / `cuh` names. A deck whose own `setup/shiki.ts` returns `transformers` replaces the transformers (Slidev merges setups key by key); import them from the theme to keep them. The language names stay (Slidev adds up every setup's `langs`).

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
| `<Person>` | `name`, `role`, `affiliation`, `avatar` (else the initials), `links`, `size` (`sm` / `md` / `lg`) |
| `<Meter>` | `value`, `max` (100), `label`, `showValue` (`true`: the percent, or `value / max unit` with `unit`; a string as is; `false`), `unit`, `color`, `warn` / `danger` (from these values it turns yellow / red), `size` (`sm` / `md` / `lg`), `animate` (fills when the slide arrives) |
| `<Ghost>` | `text`, `position` (`bottom-right` / `top-right` / `bottom-left` / `top-left` / `center`), `size` (18rem), `color`, `opacity` (0.07): a giant faint glyph behind the content |
| `<Browser>` | `url` (shown in the address bar), `src` (a screenshot as the page), `iframe` (load `url` live), `title`, `alt`, `width`, `height` (the page's); or any content in its slot: a macOS browser window |
| `<Phone>` | `src` (a screenshot), `url` (a live page), `width` (14rem; the height follows), `alt`, `title`; or any content: a phone with a camera island (`--phone-frame`) |
| `<LogoWall>` | `logos` (paths, or `{ src, name, url }`; a name alone shows as text), `columns`, `color` (grey until hovered by default) |
| `<TeamGrid>` | `people` (`[{ name, role, avatar }]`, initials without an avatar), `columns` |
| `<PhotoWall>` | `photos` (paths, or `{ src, caption }`), `columns`, `ratio` (each photo's shape, `4 / 3`) |
| `<ChevronFlow>` | `steps` (titles, or `{ title, desc, color }`), `active` (1-based; the steps before it read as done): a process as arrows |
| `<Pyramid>` | `levels` (top first: titles, or `{ title, note, color }`; a note sits beside its level) |
| `<Cycle>` | `items` (clockwise from the top: titles, or `{ title, color }`), `center`, `size` (20rem): a loop with arrows |
| `<HexGrid>` | `items` (titles, or `{ title, icon, color }`; three make a triad), `columns`, `size` (9rem): hexagons in a honeycomb |
| `<BlockDiagram>` | `blocks` (`[{ id, label, sub, x, y, w, h, color }]`, position and size in % of the stage), `steps` (block ids, or `{ block, caption }`: a focus frame glides to the next on each click, counting in the slide's clicks), `height` (16rem) |
| `<StackDiagram>` | `layers` (top first: titles, or `{ title, note, color }`), `active` (a title or a 1-based place) |
| `<DrawOn>` | `duration` (1.5s): draws the strokes of the SVG in its slot once the slide has arrived (exports show them drawn) |
| `<ErrorSpotlight>` | slots `error`, `cause`, `fix` (Markdown, code); `errorTitle`, `causeTitle`, `fixTitle`: a bug story in three panels |
| `<BeforeAfter>` | slots `before`, `after`; `beforeLabel`, `afterLabel`, `delta` (under the arrow, e.g. `4× faster`) |
| `<Benchmark>` | `results` (`[{ label, value }]`, the first is the baseline), `unit`, `lowerIsBetter` (true: times; false: rates), `title`: bars, the winner lit, each result's ratio to the baseline |
| `<GithubCard>` | `type` (`issue` / `pr`), `repo` (`owner/name`), `number`, `title`, `state` (`open` / `closed` / `merged` / `draft`), `author`, `labels`; nothing is fetched |
| `<Lesson>` | `title`, `kicker` (`Lesson learned`); its slot is the story |
| `<ProsCons>` | `pros`, `cons` (lists), `prosTitle`, `consTitle` |
| `<StickyNote>` | `color` (a theme color name, yellow by default, or any CSS color), `rotate` (degrees, −1.5), `title`, `width`: a glass sticky note with a strip of tape; place it with classes (`absolute right-8 top-20`) |
| `<SpeechBubble>` | `side` (`left` / `right`: where the speaker is), `name`, `avatar` (image path), `color`: a glass bubble with its speaker |
| `<ClickTabs>` | `tabs` (the labels; panes are the slots `tab1`, `tab2`, …): one window whose tab moves on each click (counts in the slide's clicks); a click on a tab jumps to it. `steps: false` drops the clicks and switches on a tab click; `active` (1-based) picks the first tab then. The window is as tall as the tallest pane, and looks like a code group; an export shows the last tab |
| `<Timeline>` | `items` (`[{ title, year, desc, color }]`), `active` (a static highlight), `steps` (each click reveals the next item and moves the highlight; counts in the slide's clicks), `animate` (items fade in top to bottom when the slide arrives) |
| `<ComplexityTable>` | `title`, `rows` (`[{ n, target, algo, complexity, highlight }]`), `showComplexity` |
| `<Stat>` | `value` (as written: `"$4.2M"`, `"98.5%"`, `"1,024"`), `label`, `delta` (`"+12%"`; its sign picks ▲ / ▼), `good` (`up` or `down`: which way is green), `count` (counts up from 0 when the slide arrives; exports show the figure), `color`, `size` (`sm` / default / `lg`), `plain` (no card) |
| `<Countdown>` | `minutes`, `size` (preset `sm` `default` `lg` `xl`, or any CSS length, as `<QRCode>`), `label`, `autoStart` (`false`: a ▶ start button), `showZero`. Click the timer to pause / resume, double-click to reset |
| `<QRCode>` | `url` (empty: this deck), `slide` (`true`: this slide, or a number), `size` (preset or any CSS length), `caption`, `ecc` (`L` / `M` / `Q` / `H`), `api` (`{data}`, `{size}` are replaced), `src` |
| `<PresenterNote>` | (slot; shown only in the presenter view, or on the slide too with `class="show"`) |

`<QRCode>` is generated in the browser, so it works offline and in exports, and the URL is not sent anywhere. It is also a link. Without `url` it points to this deck: `seoMeta.ogUrl` from the headmatter if set, otherwise the address it is served from, with `--base` and `routerMode` applied, but only when that address is public. A dev server, `slidev export` and private addresses (`localhost`, `127.*`, `10.*`, `172.16–31.*`, `192.168.*`, `*.local`) would give the audience a dead link, so there it draws a dashed "No public URL" box instead (nothing in an export) and warns in the console; set `seoMeta.ogUrl` before exporting, and `url` for a deck on an intranet address. A `url` starting with `javascript:`, `data:`, `vbscript:` or `file:` draws no code. `api` switches back to a QR image service.

A `color` prop (`Stat`, `StoryBox`, `PatternCard` sections, `Timeline` items) takes the theme's names — `primary`, `blue`, `cyan`, `green`, `yellow`, `red`, `gray`, which follow light mode and a `themeConfig` palette — or any CSS color. `<Badge variant>` has the same names. For numbers in text and tables: `.num` (digits of one width) and `.table-num` around a table (columns after the first right-aligned).

Text in `ComplexityTable`, `PatternCard`, `Timeline` and `StoryBox` props (and the `exercise` layout's `method` / `expected`) supports `$...$` math (KaTeX), `x^y` superscripts, `` `code` `` and `**bold**`; write `\$` for a literal dollar sign.

### Stage indicator

```yaml
---
stages: ["Concept", "Implementation", "Practice"]
currentStage: 1
stagePosition: top     # top | top-left | top-right | bottom | left | right
---
```

Click a stage to jump to the first slide with the same `stages` at that `currentStage`. To pick other slides, give `stageMap` with each slide's `routeAlias` (`stageMap: [intro, deep, wrap]`); page numbers work too but go stale when slides move. An entry that points past the end or at a slide of other stages is reported in the console, and the click uses the matching slide instead.

**Automatic sections**: `stages: auto` (in the headmatter for every slide, or on one slide) builds one stage per `layout: section` slide, named by its title; a slide with `chapter: "Name"` starts a section too, and `chapter: false` leaves a section slide out. A click goes to the section's first slide. A slide's own `stages` list still wins, and `stages: false` hides the indicator there. `stagePosition` in the headmatter is the deck's default.

`stageLabels` picks the labels shown inline: `all` (default), `active` (only the current one; the default for more than 6 automatic sections) or `hover` (a dot rail). The others show beside their dot on hover or keyboard focus.

`bottom` sits above the footer line when one shows. `left` / `right` take a column of their own: the content slide's padding on that side grows by `--stage-side-space` (6.5rem), and labels wrap at `--stage-side-label-width` (5.5rem).

## CSS Classes

| Class | |
|---|---|
| `.card` | Card container with hover lift |
| `.alert` + `.alert-info` / `-success` / `-warning` / `-error` | Callouts |
| `.gradient-text`, `.gradient-text-1` / `-2` / `-3` | Gradient text |
| `.gradient-card` | Card with a gradient bar on top |
| `.gradient-border` | Gradient outline |
| `.glass-gradient` | Frosted glass card |
| `.btn-macos` (+ `-primary` `-secondary` `-destructive` `-success`, `-small` `-regular` `-large`, `-rounded` `-capsule`, `-icon`, `-toolbar`, `-loading`), `.btn-macos-group`; dimmed with `disabled` or `.disabled` | macOS-style buttons |
| `.macos-traffic-lights` / `.macos-traffic-light` | Window dots |
| `.table-compact`, `.table-dense`, `.table-auto`, `.table-square` | Table variants (on the table or a wrapper) |
| `.stack` | Its children in one spot, on top of each other (a build-up with `v-click`, before/after images); as big as the biggest |
| `.stretch` | Fills the height left on the slide (an image, video, diagram or code block), above the footer line |
| `.list-cols-2`, `.list-cols-3` | A list (the class on it or a wrapper) in columns |
| `.list-badges` | A numbered list with its numbers in round badges |
| `.verdict-table` | Around a comparison table: cells with `<span class="v-good">` / `v-meh` / `v-bad` are tinted and marked ✓ ~ ✗; a `v-pick` lights its row ★ |

## Progress Bar, Page Number & Footer

Set deck-wide options in the headmatter; a slide's own `progressBar` / `pageNumber` / `footer` overrides it for that slide.

```yaml
---
progressBar: content          # always (default) | content | false
progressBarSkip: 2, 5-6       # pages without the bar (list, ranges, or an array)
progressBarSkipMode: exclude  # hide (default): only hide the bar
                              # exclude: also leave skipped pages out of the progress
pageNumber: false             # hide the page number (default: shown, except on title slides and section dividers)
pageNumberFormat: c of t      # c/t (default, "3 / 12") | c ("3") | c of t ("3 of 12")
paceBar: true                 # a time marker on the bar (see below)

# Exports only (PDF / PNG / ?print); the presentation is unchanged
progressBarInExport: false
pageNumberInExport: false
footerInExport: false
---
```

**Pace marker**: with `paceBar: true`, a tick on the progress bar shows the time used of the deck's `duration` (Slidev's option, `30min` by default; `1h15m`, `45:00` work too) once the timer in the presenter view runs. Next to the fill (the slides done) it reads at a glance: green on pace, yellow more than 5% behind, red more than 15% behind. Exports leave it out. Colors: `--pace-on-color`, `--pace-behind-color`, `--pace-late-color`.

On one slide, `pageNumber: skip` hides the number and leaves the slide out of the count, and `pageNumber: hold` shows the last number again without counting the slide (for a build-up split over slides). `appendix: true` on a slide starts the appendix: from there on the pages are A1, A2…, and the total shown before stays the count of the main part.

**Deep-dive slides**: `aside: true` on a slide adds an accent rail on the left edge and a "Deep dive" tag in the top-left corner; `aside: "Label"` sets the tag's text. Not on title slides and section dividers. Variables: `--aside-color` (the rail), `--aside-rail-width`.

**Confidential ribbon**: `confidential: true` in the headmatter puts a red "CONFIDENTIAL" band across the top-right corner of every slide, PDF/PNG exports included. A string sets the label (`confidential: 대외비`); an object sets `label`, `company` (a smaller second line) and `position` (`top-right` / `top-left`). `confidentialOn: openers` limits it to cover, intro, section and end slides. A slide's own `confidential` replaces the deck's there: `false` hides it, `true` shows the deck's, anything else its own. Long text shrinks, then ends in "…". A stage indicator or `aside` tag in the same corner moves along the top edge; at `top-left` the band crosses the start of a content slide's title. Variables: `--ribbon-color`, `--ribbon-text-color`, `--ribbon-size`, `--ribbon-font-size`.

**Slide hotkeys**: `hotkey: q` on a slide makes <kbd>q</kbd> jump to it from anywhere (agenda, Q&A, appendix); modifiers work too (`shift+a`). Slidev's own keys (space, arrows, `d`, `o`, `g`, `f`, …) are kept: a hotkey on one of them, a key used twice or a value that isn't a key is reported in the browser console. A deck's own `setup/shortcuts.ts` still works and receives these in `base`.

**Kiosk auto-advance**: `autoAdvance: 8s` in the headmatter steps the deck by itself (each click, then each slide); a slide's own `autoAdvance` sets its wait, and `false` stops there. `autoAdvanceLoop: true` starts over after the last step. A key, click, scroll or touch pauses it until the deck is left alone for `autoAdvanceIdle` (30s). Times read like Slidev's `duration` (`8s`, `1m`, `0:30`, or seconds). It runs in the play view only: not in exports, nor in the presenter view.

### Slide backgrounds

The title and centered layouts (`cover`, `intro`, `section`, `end`, `center`, `fact`, `statement`, `quote`, `full-dark`) and plain content slides take a background of their own:

```yaml
---
background: /photo.jpg          # an image (public/ or a URL), a CSS color, or a CSS gradient
backgroundOpacity: 0.6          # 0–1 or "60%": the background only
backgroundFilter: blur(4px)     # any CSS filter, on the background only (the text stays sharp)
backgroundScrim: 0.7            # images get a scrim in the slide's own color (0.55); false turns it off
bg: mesh                        # a generated pattern: mesh | aurora | grain | dots | grid
---
```

`bg` draws in the accent colors (so `themeConfig.primary` changes it) and follows light mode; it can sit over a `background`. Variables: `--bg-pattern-strength` (1), `--bg-pattern-a` / `-b` / `-c` (the colors). The media layouts keep their own `image`.

**Parallax**: `parallax: /panorama.jpg` in the headmatter puts one wide image behind every slide; its horizontal position follows the page, so it drifts a little on each step. Each slide's background turns translucent in its own color (dark layouts tint it dark, light slides light): `parallaxTint` (0.72) is how much of it stays. A slide's own `parallax: false` keeps its opaque background, and a slide's own image shows on that slide only. Exports give each page its own offset. Variables: `--parallax-shift` (20%: how far the image travels over the deck), `--parallax-duration` (0.8s).

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
date: '2026-10-09'            # quote dotted dates like '2026.10': YAML reads them as numbers
logo: /logo.svg               # from public/; crop it without padding
footer: true                  # show them at the bottom left (off by default)
# footer: [title, event]      # or pick the ones you want, in this order
---
```

- **Cover**: the first slide shows the details that are set; `coverInfo: false` turns them off there. Another `cover` slide shows them only with `coverInfo: true`, and its own `author` / `authors` / `affiliation` / `event` / `date` / `logo` replace the deck's (a cover with its own people leaves out the deck's `affiliation` unless it sets one).
- **Footer**: `footer: true` shows title · author · event · date and the logo (those that are set); a list picks them in its order (`logo` and `affiliation` too). The page number stays at the bottom right, and a long line ends in "…" before it. The line takes about 3rem at the bottom of the slide: the column layouts' `bottom` slot and a `<Footnote>` move up above it, but ordinary content does not, so leave that room on a full slide (or turn the footer off there). Like the page number, it is hidden on title slides and section dividers. It is also hidden on media layouts (`image`, `iframe`, `full-image`, `full-split`), whose picture or page reaches the bottom edge, unless the slide sets its own `footer`.
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
| Shared tokens | `--radius-lg` (0.75rem: cards, tables, code blocks, boxes; the per-component radius variables default to it), `--transition-fast` / `-base` / `-slow` (150 / 250 / 300 ms), `--shadow-md` / `-lg` / `-xl` (lighter in light mode) |
| Content slides | `--slide-padding`, `--slide-padding-x`, `--slide-title-top`, `--slide-font-size` |
| Code blocks | `--slidev-code-font-size` (0.8rem; Slidev's variable, now followed by the code inside blocks too) |
| Emphasis layouts | `--quote-mark-size`, `--quote-size`, `--statement-size`, `--fact-size`, `--full-text-padding` |
| Code blocks, images | `--code-max-height`, `--image-max-height` (none by default; code that doesn't fit is cut off, never scrolled) |
| Utility guards | `--grid-padding-x` (2rem side padding on `grid` inside slides), `--flex-wrap` (`flex` wraps by default), `--absolute-max-width` |
| Slide transitions | `--slide-transition-duration` |
| Progress bar / page number | `--progress-height`, `--progress-color`, `--progress-track`, `--progress-glow`, `--page-number-size`, `--page-number-color`, `--page-number-right`, `--page-number-bottom`, `--pace-on-color`, `--pace-behind-color`, `--pace-late-color` |
| Cover details | `--cover-info-color`, `--cover-info-muted`, `--cover-logo-height` |
| Footer line | `--footer-size`, `--footer-color`, `--footer-left`, `--footer-bottom`, `--footer-logo-height`; `--footnote-bottom-with-footer`, `--footnote-bottom-with-stage`, `--footnote-bottom-with-footer-and-stage` (where a `<Footnote>` goes then); `--footer-clearance-with-footer` (room the column layouts' `bottom` slot leaves above the line, 1.5rem) |
| Stage indicator | `--stage-done-color`, `--stage-active-color`, `--stage-upcoming-color`, `--stage-dot-size`, `--stage-font-size`; `--stage-bottom-with-footer`, `--stage-side-space`, `--stage-side-label-width` |

### Components

| | Variables |
|---|---|
| `<Badge>` | `--badge-color` |
| `<Kbd>`, gray badge | `--key-bg` (light mode: `--light-key-bg`) |
| `<StoryBox>` | `--story-color`, `--story-padding`, `--story-radius` |
| `<PatternCard>` | `--pattern-color` |
| `<ClickTabs>` | `--click-tabs-active` (the underline), `--click-tabs-pane-padding` |
| `<Timeline>` | `--tl-dot-color`, `--tl-active-color`, `--tl-line-color`, `--tl-year-color` |
| `<Stat>` | `--stat-size`, `--stat-color`, `--stat-count-duration` (`--motion-slow`, 1.2s) |
| `<Footnote>` | `--footnote-size`, `--footnote-bottom`, `--footnote-left`, `--footnote-right` |
| `<Countdown>` | `--countdown-size`, `--countdown-color` |
| `<QRCode>` | `--qrcode-size` |
| Tables, `<ComplexityTable>` | `--table-radius` (or `.table-square`) |
| `.card` | `--card-radius`, `--card-padding`, `--card-margin`, `--card-hover-lift` |
| `.alert` | `--alert-padding`, `--alert-margin`, `--alert-radius`, `--alert-border-width`; tints `--alert-info-bg`, `--alert-success-bg`, `--alert-warning-bg`, `--alert-error-bg` (both modes; `themeConfig` accents set them) |
| `.btn-macos` | `--macos-radius`, `--macos-font-size`, `--macos-padding`, `--macos-height`; fills `--macos-blue` / `-blue-hover`, `--macos-red` / `-red-hover`, `--macos-green` / `-green-hover` (deepened from Apple's system colors so white labels pass WCAG AA; set Apple's `#007AFF` / `#FF3B30` / `#34C759` for the exact look) |

### Animations

| Effect | Variables | Presets |
|---|---|---|
| Entrances (`anim-fade-in`, `anim-fade-up`, `anim-fade-left`, `anim-fade-right`, `anim-pop`) | `--anim-duration`, `--anim-distance`, `--anim-delay`, `--pop-scale` | `anim-delay-1` … `-5` |
| `stagger` (on a container: its children, or a list's items, one after another) | `--stagger-step` (0.08s), and the entrance variables | |
| `anim-float`, `anim-cursor` | `--float-distance`, `--float-duration`, `--cursor-color`, `--cursor-duration` | |
| `anim-border` | `--ab-c1`, `--ab-c2`, `--ab-c3`, `--ab-dim` (resting border), `--ab-len` (light length), `--ab-width` (ring width, 2px), `--ab-duration` (`s` or `ms`) | colors `-ocean` `-sunset` `-neon` `-ice` `-fire` `-mint` `-gold`; direction `-ccw`; speed `-slow` `-fast`; width `-thin` `-thick`; length `-short` `-long` (combinable) |
| `anim-shimmer` | `--shimmer-color`, `--shimmer-width`, `--shimmer-travel`, `--shimmer-duration` | directions `-right` `-down` `-up` `-diag`; colors `-purple` `-blue` `-green` `-warm` `-neon`; `-slow` `-fast` |
| `anim-glow` | `--glow` (any color), `--glow-intensity`, `--glow-duration` | colors `-purple` `-blue` `-green` `-red` `-cyan` `-gold` `-neon`; `-slow` `-fast` |
| `anim-gradient-text` | `--gt-c1` … `--gt-c5`, `--gt-period`, `--gt-duration` | `-ocean` `-sunset` `-fire` `-neon`; `-slow` `-fast` |
| `hover-lift` / `-scale` / `-tilt` / `-glow` / `-border` / `-gradient` / `-shine` | `--hover-duration`, `--hover-lift`, `--hover-scale`, `--hover-tilt-x`, `--hover-tilt-y`, `--hover-glow`, `--hover-border-c1` / `-c2`, `--hover-gradient-c1` / `-c2`, `--hover-shine-color`, `--hover-shine-width` | `hover-glow-purple` / `-blue` / `-green` / `-red` / `-cyan` / `-gold` / `-neon` (with `hover-glow`, or alone) |
| `v-click` presets (`v-click.pop`, or `clickAnimation: pop` on a slide or the deck) | `--motion-base`, `--motion-distance`, `--pop-scale` | `pop` `rise` `blur`, with Slidev's `fade` `up` `down` `left` `right` `scale` (combinable: `v-click.rise.blur`) |
| Click-step styles: on a container (`<div class="dim-prior">` around `<v-clicks>`) or as a click preset (`v-click.dim-prior`, `clickAnimation: hl-current`) | `--step-dim` (0.35), `--step-hl`, `--step-grow` (1.06), `--step-shrink` (0.92) | `dim-prior` `only-current` `hl-current` (`-blue` `-green` `-yellow` `-red` `-cyan`) `grow-current` `shrink-prior`; an export without clicks shows the items plainly, `--with-clicks` keeps the styles |
| Slide transitions (`transition:` frontmatter) | `--slide-transition-duration` | `slide-left` `slide-right` `slide-up` `fade` `scale-fade` `blur-fade`; content only (the background stays put): `content-left` `content-right` `content-up` `content-fade` |

Entrances (`anim-fade-*`, `anim-pop`) start once the slide has arrived: while a slide transition is still moving it in they wait, then play, and they replay each time the slide is reached. A `stagger` stops at the slide's first click: what hadn't come in yet shows at once. The defaults come from `--motion-base` (0.4s), `--motion-ease` and `--motion-distance` (0.75rem); `--motion-slow` (1.2s) times `<Stat count>`. The animated border light runs at a constant speed along the border (a small script). All animations respect `prefers-reduced-motion`.

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
| `--primary-300` / `-500` / `-600` | `#d98eff` / `#b665cb` / `#a652b8` | `#8a3aa6` / `#8e3aa8` / `#7f3396` | `--light-primary-300` / `-500` / `-600` |
| `--one-dark-yellow-dark` (italic) | `#d19a66` | `#9a5b1e` | `--light-orange` |

Light-mode accents are deeper so text stays readable (≥ 4.5:1) on white.

### Brand colors

Set your brand color in the headmatter and the theme derives the rest:

```yaml
---
theme: slidev-theme-one-purple-unicorn-pro
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
