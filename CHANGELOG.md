# Changelog

## Unreleased (4.5.0)

### Features

- **PDF fallbacks** (#137): links print as "text (url)" in exports, and an iframe shows
  its address as a link, or a `poster:` still.

## Unreleased (4.4.0)

### Features

- **Citations and numbered references** (#118): `bibliography:` + `[@key]` +
  `<References />` (numbered by first use, tooltips, links); `\label{eq:…}`, `{#thm:…}`
  and `[@eq:…]` numbered at build time, so hidden slides don't break the count.
- **Charts** (#119): `<Chart>` (bars, lines) and `<Radar>` in SVG with no library, and
  `<EChart>` for anything else (ECharts as an optional peer dependency), all in the
  theme's palette.
- **`<GoogleForm>`** (#146): a QR code and short link to a Google Form, the form or a
  published Sheet chart beside it; exports show the code and link.
- **Image walkthrough** (#159): `<ImageTour>` (callouts, masks or zoom, one spot per
  click), `<ImageCompare>` (a before/after slider) and `<PanZoom>`.
- **`<Transcript>`** (#157): an agent session, one turn per click, scrolling to the newest
  with an "N above" count.
- **`layout: document`** (#158): a long document cut at its `##` headings, an index rail,
  one section per click.
- **Glossary tooltips** (#162): `glossary:` (deck or slide) marks a term's first use with
  a tooltip; Hangul-aware word boundaries, code and links skipped.
- **Deck structure** (#163): `structure: true` gives section-aware transitions, section
  metadata on every slide and `continued:` title carry-over.
- **Live demos with a fallback** (#164): `<LiveDemo>` (status dot, video toggle, scale and
  crop, a poster in exports) and `<Interactive>` (live in the room, a still in the PDF,
  optionally a dialog).
- **IDE-chrome mode** (#168): `ide: true` turns slides into file tabs (clickable
  navigation) with a status bar for repo, branch, section and page.

## Unreleased (4.3.0)

### Features

- **Callouts** (#116): GitHub alerts (`> [!NOTE]` …) take the `.alert` look with their
  icon and name, left-aligned on centered layouts; `<StickyNote>` and `<SpeechBubble>`.
- **Speaker and questions** (#117): `layout: speaker` and `<Person>` (avatar or initials,
  name, role, affiliation, links); `end` with `questions: true` adds a QR code to the
  deck and the `contact` links.
- **`<Meter>` and `<Ghost>`** (#120): a labelled bar with warn / danger thresholds that
  can fill on arrival, and a giant faint glyph behind the content.
- **Video and tiles in the media layouts** (#121): `image`, `full-image` and `full-split`
  play a video (`image: /clip.mp4`, Slidev's `<SlidevVideo>`, `poster` in exports) and
  tile up to three pictures or videos (`imageStack: row | column`); `imageWidth` sets
  the `image` layout's split.
- **Layout utilities** (#133): `.stack` (children in one spot), `.stretch` (fills the
  height left), `.list-cols-2` / `-3` and `.list-badges`.
- **Device frames** (#138): `<Browser>` (macOS window, address bar, a screenshot, a live
  page or any content) and `<Phone>`.
- **Walls** (#139): `<LogoWall>`, `<TeamGrid>` and `<PhotoWall>`, arranged in even rows by
  count.
- **Exercise slides** (#161): `layout: exercise` with `exercise`, `time`, `method` and
  `expected`, and a countdown for the time. Prop text (StoryBox, Timeline, …) also takes
  `` `code` `` and `**bold**`.
- **Infographics** (#169): `<ChevronFlow>`, `<Pyramid>`, `<Cycle>` and `<HexGrid>`.
- **Diagram vocabulary** (#155): `<BlockDiagram>` (named blocks, a focus frame moving per
  click, captions), `<StackDiagram>` and `<DrawOn>` (SVG strokes drawn on arrival).
- **Tech-talk story pieces** (#156): `<ErrorSpotlight>`, `<BeforeAfter>`, `<Benchmark>`,
  `<GithubCard>`, `<Lesson>`, `<ProsCons>` and `.verdict-table` cells.
- **Lightbox and link preview** (#132): `.lightbox` images (or all, with `lightbox: true`)
  open full screen; `.preview` links open their page in a frame; Esc closes.

## Unreleased (4.2.0)

### Features

- **Click-step styles** (#127): `dim-prior`, `only-current`, `hl-current` (with colors),
  `grow-current`, `shrink-prior` style the items already clicked and the one just
  clicked, on a container or as a click preset (`v-click.dim-prior`,
  `clickAnimation:`). Exports without clicks show the items plainly; `--with-clicks`
  exports keep the styles (`html.print-clicks`).
- **`<ClickTabs>`** (#154): one window with a tab per version (`tabs`, slots `tab1`,
  `tab2`, …); each click moves to the next tab, a click on a tab jumps to it.
- **Prose line-stepping** (#165): ```` ```quote ```` and ```` ```prose ```` fences are text in
  the slide's type that step through their lines with code's highlight clicks
  (```` ```quote {1|2|3|all} ````).
- **Code windows across slides** (#135): with `transition: view-transition`, each code
  window moves and resizes into the matching window of the next slide (timed by
  `magicMoveDuration`).
- **Inline diagnostics and folded preambles** (#136): `// [!code error: …]` / `warning`
  / `info` / `value` at the end of a code line show as an editor's inline
  diagnostics; `// [!code fold: …]` folds the lines above it into one row.
- **Snippets by line range or content** (#152): `<<< @/code/kernel.cu[9-15]` and
  `<<< ./reduce.cu[/__global__/,/^}/]`, with a link to those lines on GitHub / GitLab /
  Bitbucket (a theme `setup/preparser.ts`).
- **Compiler Explorer links** (#153): `playground: true` (or a list of languages, deck
  or slide) puts a link on code blocks that opens them in Compiler Explorer.
- **Shrink to fit** (#129): `fit: true` (slide or deck) shrinks content that would run off
  the slide, to 0.42× at most, and wide display formulas; exports fit each page.
- **Korean typography** (#150): headings balance their lines (a Korean title no longer
  leaves one word alone: **line breaks in headings can move**), CJK opening
  punctuation starts flush, `hangul` / `hangul-consonant` / `circled` list counters,
  and `<span class="bilingual">` for a title in two languages.
- **Slidev's built-ins in the theme's colors** (#140): `v-mark` (accent by default,
  palette colors, translucent highlights), Twoslash popups, `{monaco-run}` output.
- **Mermaid theme** (#134): diagrams take the theme's colors through CSS variables in
  `themeCSS`, so they follow light mode and dark slides without being redrawn.

### Fixes

- **Light mode: titles on bare light layouts** (`center`, `full-text`, …) used the dark
  palette's gradient, 2.84:1 on white; they take the light title gradient (3.68:1 at
  its lightest) (#174).

## Unreleased (4.1.0)

### Features

- **Page-number formats** (#128): `pageNumberFormat: c/t | c | c of t` ("3 / 12", "3",
  "3 of 12"). On a slide, `pageNumber: skip` hides the number and leaves the slide out
  of the count, `hold` repeats the last number without counting the slide;
  `appendix: true` starts an appendix numbered A1, A2…, with the total frozen at the
  main part.
- **Automatic sections** (#131): `stages: auto` builds the stage indicator from the
  deck's `layout: section` slides (or `chapter: "Name"`), deck-wide or per slide; a
  click goes to the section. `stageLabels: all | active | hover` shows every label,
  only the current one (the default for more than 6 sections), or a dot rail with names
  on hover; `stagePosition` can be set in the headmatter.
- **Pace marker** (#130): `paceBar: true` puts a tick on the progress bar for the time
  used of the deck's `duration` while the presenter timer runs, green on pace, yellow
  behind, red late.
- **Deep-dive slides** (#123): `aside: true | "label"` adds an accent rail on the left
  edge and a corner tag.
- **Confidential ribbon** (#149): `confidential: true | "label" | { label, company,
  position }` in the headmatter draws a red band across a top corner, in exports too;
  `confidentialOn: openers`, and a slide's own `confidential` (false hides it). The red
  and its text keep 5:1 contrast in both modes (`--on-red`).
- **Slide hotkeys** (#170): `hotkey: q` on a slide makes that key jump to it; clashes
  with Slidev's keys and repeats are reported in the console.
- **Kiosk auto-advance** (#144): `autoAdvance: 8s` (deck or slide; `false` stops on a
  slide), `autoAdvanceLoop`, and a pause on input for `autoAdvanceIdle` (30s).
- **Slide backgrounds** (#122): the title and centered layouts and plain content slides
  take `background` (image, color or gradient), `backgroundOpacity`,
  `backgroundFilter` (on the background only) and an automatic scrim over images
  (`backgroundScrim`); `bg: mesh | aurora | grain | dots | grid` draws a pattern from
  the accent colors.
- **Parallax background** (#145): `parallax: /panorama.jpg` puts one wide image behind
  the slides that drifts with the page; the slides tint it in their own color
  (`parallaxTint`), in exports too.
- **Motion** (#167): `class="stagger"` brings children (or a list's items) in one after
  another once the slide has arrived, stopping at the first click; content-only
  transitions `content-left` / `-right` / `-up` / `-fade` move the content and leave
  the background still.
- **v-click presets** (#148): `pop`, `rise` and `blur` join Slidev's click animations
  (`v-click.pop`, or `clickAnimation: pop` on a slide or the deck), timed by the motion
  tokens.

### Internal

- The chrome and the stage indicator read the slide's frontmatter from `useNav()`'s
  `currentFrontmatter` (Slidev 52.18) (#148).
- Visual checks (#142): `npm run regress -- --engine dev --clicks` and
  `check:decks --clicks` capture every click state ("4.2" is slide 4 at click 2);
  `npm run check:pack` installs the packed tarball into a fresh deck, builds it under
  `--base /sub/` and opens every slide, failing on a 404, a page error or an asset
  loaded from outside the sub-path.

## 4.0.0

The 3.3.0–3.6.0 changes, released together with the breaking changes.

### Breaking changes

What 3.x deprecated is removed (#40). Before upgrading, search the deck for the names
on the left:

| Removed | Use |
|---|---|
| `layout: image-left` / `image-right` | `layout: image` + `side: left` / `right` |
| `layout: iframe-left` / `iframe-right` | `layout: iframe` + `side: left` / `right` |
| `layout: two-cols-header` | `layout: two-cols` |
| `layout: comparison` | `layout: two-cols` + `divider: true`, `leftLabel: Before`, `rightLabel: After` |
| `layout: full-center` | `layout: center` + `padding: 2rem` |
| `iframe`'s `title` | `iframeTitle` (`title` names the slide, as on any layout) |
| UnoCSS `primary-purple` / `-indigo` / `-violet` / `-pink` | the theme's colors, e.g. `text-[var(--primary-400)]` |
| `--one-dark-bg`, `--one-dark-fg`, `--one-dark-fg-bright`, `--one-dark-gray` | `--bg-secondary`, `--dark-bg`, `--text-bright`, `--text-muted` |
| `anim-gt-slow` / `anim-gt-fast` | `anim-gradient-text-slow` / `-fast` |

A removed layout name falls back to Slidev's `default` layout (the dev server prints
`Unknown layout "comparison"`), so the slide still renders, without its image,
columns or centering.

### Features

- **`<Stat>`** (#57): a figure with its label and change —
  `<Stat value="$4.2M" label="Revenue" delta="+18%" />`. The delta's sign picks ▲ / ▼,
  `good="down"` makes a fall green; `count` counts up from 0 once the slide has
  arrived (again on each visit; exports and reduced motion show the figure); `color`,
  `size` (`sm` / default / `lg`), `plain` (no card).
- **One set of color names** (#57): `primary`, `blue`, `cyan`, `green`, `yellow`,
  `red`, `gray` work in every `color` prop (`Stat`, `StoryBox`, `PatternCard` sections,
  `Timeline` items) and follow light mode and a `themeConfig` palette; any other value
  is still a CSS color. `<Badge variant="primary">` joins the Badge names.
- **Numbers**: `.num` (digits of one width) and `.table-num` around a table (columns
  after the first right-aligned).
- **`<Countdown>` controls** (#31): `:auto-start="false"` shows a ▶ start button; click
  the timer to pause or resume, double-click to reset. Space still moves to the next
  slide.
- **`<Timeline>` steps and entrance** (#32): `steps` reveals one item per click and
  moves the highlight (the steps count in the slide's clicks, like `<v-clicks>`);
  `animate` fades the items in top to bottom once the slide has arrived. Exports show
  every item.
- **`anim-border` options** (#34): ring width `--ab-width` with `-thin` / `-thick`, and
  `-short` / `-long` for the light; they combine with the colors, `-ccw`, `-slow` and
  `-fast`. The example deck shows each option side by side.

- **`<Countdown size>` takes any CSS length** (`size="2.5rem"`), as `<QRCode>` does,
  besides the presets (#74).

### Fixes

- **Light-mode exports: the chrome over a dark layout is dark again** (#106
  regression): the progress bar, footer and page number over a dark layout took the
  light palette in light-mode PDF/PNG exports.
- **Border beams after the export page**: a tab opened on the export page and then
  sent to the presentation had no moving light; an `anim-border` class added to an
  element already on the slide now gets one too (#89).
- **Utility classes on images apply** (`w-40`, `mx-0`, ...): the theme's image rule
  outweighed them (#84).

### Changes

- **Light mode weighs like dark mode** (#84): each light-mode rule weighs what the
  dark rule it replaces weighs, so a component's own style or a utility class wins in
  both modes. Visible change: `<ComplexityTable>`'s header line is its own 1px in
  light mode, as in dark mode (was 2px).

- **Inline code chips follow the theme** (#94): the theme's chip rule used to lose to
  Slidev's, so dark chips were Slidev's `#1b1b1b`; they use the code background
  (`#21252b`) now, like chips in headings and on dark layouts. Size, corners and
  padding are unchanged.
- **`--slidev-code-font-size` works on code blocks** (#95): the theme's 0.8rem also
  reached the code inside blocks, so the variable did nothing; it is now the block
  size, 0.8rem by default.
- **Spacing between code blocks and headings applies** (#96): the rules targeted
  `pre`, but Markdown blocks are `.slidev-code-wrapper`.
- **Shared tokens** (#103): `--radius-lg` (0.75rem) is the corner size the card,
  table, story and code radii default to; `--transition-slow` (300ms) joins
  `--transition-fast` / `-base`; hover-lift / hover-scale / LinkCard shadows lighten in
  light mode. Light mode has one tertiary grey.

### Internal

- `utils/slide-motion.ts` (`onSlideArrival`), `utils/number.ts`, `utils/colors.ts`,
  with tests; `--motion-slow` (1.2s) joins the motion tokens (#57).

- Structure (#62): `applyThemeConfig()` (#90), `outputLines()` out of the terminal
  transformer (#87), CUDA token data in `cuda-tokens.ts` (#88), global-bottom's logic
  in tested utils (#83), tests for the pure logic that had none (#86), the light-mode
  lists side by side with the private variables documented (#82), one `slide-chrome`
  marker (#79), CSS rules in the files they belong to (`blocks.css`, `print.css`, #85),
  `styles.css` marks where import order matters (#84).
- Slidev internals the theme relies on are listed in `utils/slidev-dom.ts` and DEV.md,
  checked by `npm run check:slidev` after a Slidev upgrade (#81).
- Export code in three parts (#80): `setupPrintMode()` (print-mode.ts, called first),
  the capture hold (export-hold.ts), and the redraws (print-export.ts) with named
  `watchColorScheme()` / `watchEditableExport()`. Slide arrival watches `#slideshow`
  instead of the whole page (#89).

- Duplicated code in one place: `columnLayoutProps()` for the column layouts (#76), a
  shared background-image style for the media layouts (#75), the glow peak and the
  entrance list in `animations.css` (#73), the print-redraw helpers (#77), restated
  CSS rules (#78: `.box-shell`, `.tint-pill`, `--dot-glow`, transitions, Shiki HAST
  helpers), and `scripts/lib/shots.mjs` for `check-decks` / `regress` (#65).
- A test keeps the light-mode variable lists in sync (#72).
- The inline-code chip outranks Slidev's rule by specificity, not load order (#94
  follow-up).

- `!important` only where it is needed (13 of 24 dropped, #99); declarations with no
  effect removed (#100); unprefixed `mask` (#102); the quote layout marks its quote
  element instead of a `:has()` chain repeated three times, and the twoslash line
  reset is scoped (#104); export-only rules follow one convention, written down in
  DEV.md (#105).

## 3.2.0

### Performance

- **KaTeX loads only when a component prop has `$…$` math** (#110). It was a 259 KB
  (78 KB gzip) chunk for every deck using `StoryBox`, `Timeline`, `ComplexityTable` or
  `PatternCard`. A formula shows as text for a moment until it arrives; exports wait
  for it.
- **Iframe slides load their page only when you are on them or next to them** (#107).
  They loaded at startup and ran hidden all talk (8–10 % of a core for the example's
  sli.dev page); they stop again once you move on. Exports always load them.
- **The Nerd Font symbols come in 11 pieces by glyph set** (#109) instead of one
  1.2 MB file; a slide loads only the pieces its icons are in (a powerline prompt:
  8 KB). All glyphs are kept.
- **Entering a dark layout no longer triggers a long style recalc** (#106): the chrome's
  dark palette is chosen in JS once per navigation instead of by a `:has()` that Chrome
  re-ran on every slide change (long tasks 263 → 87 ms over 12 dark slides at 4× CPU).

### Features

- **`stageMap` takes `routeAlias` names** (`stageMap: [intro, deep, wrap]`), which
  survive slides being added or moved; a stale or unknown entry is reported in the
  console and the click goes to the matching slide (#49).
- **`hover-glow` colors as for `anim-glow`:** `hover-glow-purple` / `-blue` / `-green` /
  `-red` / `-cyan` / `-gold` / `-neon`, with `hover-glow` or alone (#30).

### Changes

- `styles/index.css` is now `styles/content.css`: Slidev loaded it a second time on its
  own (#53).
- `devEngines` accepts npm 11 and later (was 12), so `npm test` runs with the npm that
  comes with Node 24. `.npmignore` and the `link` / `unlink` scripts are gone (#55).
- README: `::code-group` needs `mdc: true` (#46); `PresenterNote class="show"`, column
  width shares, `--alert-*-bg`, `--footer-clearance-with-footer` and the light shades
  documented (#55).

### Deprecations

- The UnoCSS colors `primary-purple` / `-indigo` / `-violet` / `-pink`
  (`text-primary-purple` …) are deprecated and will be removed in 4.0: the theme never
  used them, and they ignore `themeConfig` colors (#26).
- `--one-dark-bg`, `--one-dark-fg`, `--one-dark-fg-bright`, `--one-dark-gray` (unused,
  undocumented, and `-fg` is darker than `-bg`) and the `anim-gt-slow` / `anim-gt-fast`
  aliases of `anim-gradient-text-slow` / `-fast` are deprecated and will be removed in
  4.0 (#55).

### Internal

- `regress.mjs` hides iframe content and the countdown digits and waits for code
  blocks to stop scrolling, so those slides no longer differ run to run (#113);
  `.gitignore` also ignores symlinked `node_modules` (#112).

## 3.1.0

### Changes

- **Requires Slidev 53+** (Node 22.12+), up from 52. On Slidev 52.0 the theme already
  failed to compile `ComplexityTable` and `Timeline`, and Slidev before 52.9 replaces
  the bundled languages when a setup passes `langs`, which the `cuda` fences need.
  The demo and the consumer decks run on 53.

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
  the hover-lift glow, progress glow and light-mode shimmer were fixed purple/blue; they now use
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

### Deprecations

- The 1.x layout aliases (`image-left`, `image-right`, `iframe-left`, `iframe-right`,
  `two-cols-header`, `comparison`, `full-center`) are deprecated and will be removed
  in 4.0. Use the equivalents in the README's *Compatibility Aliases* table.
- `iframe`'s `title` is deprecated in favor of `iframeTitle` (see Fixes) and will be
  removed in 4.0.

### Fixes

- **macOS buttons:** the toolbar button has a faint fill and border at rest (it read
  as plain text on a slide or in a PDF, #33); the loading spinner shows (it drew in
  the hidden label's transparent color, #43); secondary and toolbar buttons react to
  hover and press in dark mode too (#98).
- **`slide-left` / `-right` / `-up` moved a full slide plus 24px** (#97): the
  theme's 24px shift was added to Slidev's full-width one. They now move 24px with a
  fade, as intended, and `slide-down` does the same.
- **`anim-border` showed two lights on short boxes** (#52): the light's radius is
  capped at 3/4 of the box height. Direction and speed checked for every preset and
  `-ccw` (#50).
- **`<QRCode>` showed the link underline bar on hover** (#101).
- **Light-mode alerts ignored `--alert-*-bg`** (#68), so a deck's or `themeConfig`
  accents' alert tint applied in dark mode only.
- **Two different traffic-light reds, yellows and greens** (#69): code-window title
  bars and `.macos-traffic-light` both use `--macos-close` / `-minimize` /
  `-maximize` now.
- **With `themeConfig.primary`, light-mode content titles lost the palette's
  gradient** (from the #25 fix): the palette now also sets
  `--light-cover-h1-gradient`, its own stops with the end deepened to 3:1.
- **Inline code in a gradient heading was an empty chip** (#19): content titles,
  cover / intro / section titles, `.gradient-text` and `anim-gradient-text`. It is a
  normal chip with visible text now, in exports too.
- **Light mode: the end of a long content title faded** (#25): the title gradient's
  last stop (`#60a5fa`, 2.54:1 on white) is `#3b82f6` (3.68:1) on light content
  slides.
- **Light mode: bold was hard to tell from body text** (#39). It takes the primary's
  dark shade (`--primary-600`, 7.5:1 on white), as dark mode marks it in yellow.
- **Text under WCAG AA** (#45): macOS button fills are deeper (`--macos-blue`
  `#0064E0`, `--macos-red` `#D70015`, `--macos-green` `#1E7E34`; set Apple's
  originals back through the variables), inline code on dark layouts in light mode
  uses the code background, dark-mode tint chips (badges, column labels) are a
  little lighter (`--ink-depth: 70%`), and the LinkCard arrow uses `--primary-300`.
- **`.glass-gradient` had no blur in built decks** in Chrome and Firefox (#92):
  `slidev build` kept only the `-webkit-` copy of `backdrop-filter`.
- **Click exports showed an entrance-animated step before its click** (#93): a
  `v-click` element with `anim-pop` / `anim-fade-*` / `anim-float` was visible at
  every step. It now stays hidden until its click; without `v-click` it still prints
  in its final state.
- **Effects in the footer line weren't redrawn in PDF exports** (#66), e.g. a footer
  given gradient text.
- **A slide with an empty `currentStage` could be taken for the first stage** when
  clicking the stage indicator (#67).
- **The footer line ran over pictures and embedded pages** (#41) on `image`,
  `iframe`, `full-image` and `full-split`, which fill the slide to its bottom edge.
  It is hidden there now unless the slide sets its own `footer`. The README also says
  how much room the line takes on other slides (#44).
- **`<FloatImage>` ignored `--base`** (#91): a `/public` path now goes through
  `resolveAssetUrl`, like the layouts' images.
- **`stagePosition: bottom` / `left` / `right` overlapped the slide** (#48). `bottom`
  sat on the footer line; it now moves above it (a `<Footnote>` moves up further).
  `left` / `right` were drawn over tables and boxes; the content slide now leaves a
  column for them (`--stage-side-space`), and their labels wrap.
- **`<QRCode />` without `url` encoded a local address** (#47): on a dev server
  `http://localhost:3031/`, in an export the temporary export server, both dead links
  for the audience. It now uses `seoMeta.ogUrl`, or the served address only when that
  host is public; otherwise it draws a dashed "No public URL" box (nothing in an
  export) and warns in the console. A `url` with a `javascript:`, `data:`,
  `vbscript:` or `file:` scheme draws no code.
- **An `iframe` slide's `title` renamed the slide** (#54). It is Slidev's own slide
  title too, so the overview, `<Toc>` and the presenter listed the slide by the
  embedded page's name instead of its heading. The screen-reader name is now
  `iframeTitle`; `title` still works for it.
- **Entrance animations played while the slide was still sliding in** after a slide
  transition, so they were over by the time it stopped (#51). They now wait for the
  transition and replay on each visit; without a transition nothing changes. New motion
  tokens `--motion-base` / `--motion-ease` / `--motion-distance` hold their defaults.
- **A ```` ```cuda ```` code block failed the whole slide** (Shiki has no CUDA grammar). `cuda`, `cu` and `cuh` now highlight as C++, with the CUDA names colored (#42). The theme declares `shiki` as a dependency (`^4.4.3`, as Slidev).
- **Code blocks without a title had 4px corners** (Slidev's `--slidev-code-radius`,
  applied with `!important`) instead of the theme's 0.75rem, unlike titled blocks.
- **The column layouts' `::bottom::` slot sat on the footer line** when `footer` was on;
  it now stays above it, like `<Footnote>`.
- **CUDA highlighting colored names inside strings and comments** (`"cudaMalloc failed"`,
  `// kernel<<<g, b>>>`); it skips them now. Launches with nested template arguments
  (`foo<std::vector<int>><<<g, b>>>`) are marked. It looks names up in one table
  instead of running 13 patterns over every piece of text (same output).
- **Shell sessions:** the lines of a `for … done` / `if … fi` / `{ … }` block, a pipe or
  `&&` at the end of a line, and a heredoc were muted as output; they stay commands.
  In a `$` session, an output line containing ` ❯ ` was taken for a prompt. A `<<<`
  here-string or `$((a << b))` no longer counts as a heredoc, and a quoted string
  over two lines stays the command.
- **`slidev export` wrote no images or pages, or captured before the theme's redraws.**
  Slidev looks for a loading marker once, right after the page loads, then captures;
  the theme's marker came later (after its code ran), and was also removed before
  slides that took a while to compile were on the page. A PNG export then reported
  "exported" with no files (6 of 6 runs on the example deck), and an export could miss
  the redrawn shadows and gradient text. The marker is now in the page from the start
  (the theme's `index.html`) and stays until the slides are there and redrawn.
- **Slide chrome on a slide with `class: slide-dark`** (progress bar, footer, page number,
  stage indicator) kept its light-mode colors over the dark slide. The chrome now
  follows the slide's own `slide-dark` class instead of a list of layout names, so a
  slide marked dark, or a deck's own dark layout, gets it too. A background class on a
  dark centered layout (cover, section…) is no longer painted over.
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

### Internal

- `var()` fallbacks for tokens `colors.css` always defines are gone (146; many
  disagreed with the real values, #70), and the gradient-text clip/fill block is one
  rule in `gradients.css` instead of 7 copies (#71). No visual change.

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
