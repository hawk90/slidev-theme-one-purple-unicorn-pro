---
name: one-purple-unicorn
description: Write Slidev decks with the One Purple Unicorn Pro theme (slidev-theme-one-purple-unicorn-pro) - layouts, headmatter options, components and how to check a deck. Use when creating or editing slides.md for a deck whose headmatter says `theme: slidev-theme-one-purple-unicorn-pro`, or when asked for a talk, lecture or tech deck in this theme.
---

# One Purple Unicorn Pro decks

A Slidev theme for technical talks: light and dark modes, Korean and English typography, code-first (CUDA/C++ highlighting, window bars, Compiler Explorer links), diagrams and data components. Every layout and component, with each prop, its type, default and meaning, is in [reference.md](reference.md) (generated from the theme's code: trust it over memory).

## Start a deck

```yaml
---
theme: slidev-theme-one-purple-unicorn-pro
title: Memory Coalescing on GPUs
author: Jane Doe
event: GPU Meetup 2026
date: 2026-11-20
footer: true          # title · author · event · date on content slides
stages: auto          # a section indicator from the `layout: section` slides
structure: true       # slide-left into a section, slide-up within one
---
```

The first slide is the cover (`layout: cover` is implied by the headmatter slide's title). Then one idea per slide.

## Choose a layout

- Plain content: no `layout:` (title pinned at the top, content below). Too long? `fit: true` shrinks it; better, split it, or `continued: true` on the next slide carries the title over.
- Chapter break: `layout: section`. Title, about, Q&A: `cover`, `intro`, `speaker`, `end` (`questions: true`, `contact:`).
- Side by side: `two-cols` / `three-cols` with `::left::` `::right::` (`leftWidth: 2` → 2fr), `divider: true`.
- A picture or video with text: `image` (`image:`, `side: left|right`, `alt:` always), full-bleed: `full-image`, `full-split`. A live page: `iframe` (`url:`, `poster:` for the PDF).
- One big message: `statement`, `fact` (a number), `quote`.
- A long spec stepped through: `layout: document` (its `##` headings, one per click). A lab: `layout: exercise` (`exercise:`, `time:`, `method:`, `expected:`).

## Pick a component (details in reference.md)

| To show | Use |
|---|---|
| a number that matters | `<Stat value label delta>`, `<Meter>`, `<Benchmark :results>` |
| data | `<Chart :data :labels type>`, `<Radar>`, `<EChart :option>` |
| a process or hierarchy | `<ChevronFlow>`, `<Pyramid>`, `<Cycle>`, `<Timeline>`, `<StackDiagram>`, `<BlockDiagram>` |
| code and its effect | fenced code with `{lines|clicks}`, `<<< @/file.cu[9-15]` (real source lines), `<ErrorSpotlight>`, `<BeforeAfter>`, `playground: true` |
| a screenshot walkthrough | `<ImageTour :spots>`, `<ImageCompare>`, `<PanZoom>`, `<Browser>`, `<Phone>` |
| a conversation or agent run | `<Transcript :turns>` |
| a demo that might fail | `<LiveDemo src video poster>`, `<Interactive image dialog>` |
| people and links | `<Person>`, `<TeamGrid>`, `<GithubCard>`, `<LinkCard>`, `<QRCode>` |
| asides | `<StickyNote>`, `<SpeechBubble>`, `<Footnote>`, GitHub alerts (`> [!NOTE]`), `<Badge>`, `<Kbd>` |
| audience input | `<GoogleForm>` (QR code, form or results) |
| citations | `bibliography: refs.bib` in the headmatter, `[@key]` in text, `<References />` |
| terms | `glossary: { term: definition }` (headmatter or slide) |

Reveal step by step with `v-click` / `<v-clicks>`; components with steps (ImageTour, Transcript, document) count in the slide's clicks.

## Rules that keep decks right

- Every picture gets alt text: `![what it shows](/shot.png)`, `alt:` on image layouts (`alt: ""` for decoration). The build warns otherwise.
- Local pictures go in `public/` and are referenced as `/name.png`; a missing one shows a placeholder naming the path.
- Use the theme's colors by name (`color="blue"`, `var(--primary-400)`), never hard-coded hex for text: both modes must stay readable.
- Headings: one `#` title per slide. Korean text needs no manual breaks (`keep-all` is on).
- Don't put two `$` on one line outside math: Markdown reads a pair as KaTeX.

## Check before you hand it over

```bash
npx one-purple-unicorn-lint slides.md   # unknown layouts, missing props, typos in keys
npx slidev                              # dev: shift+L layout guide; a red outline marks overflow
npx slidev export                       # PDF; links print as "text (url)"
```

Fix every lint error and every overflow outline. Look at each slide in both modes (`d` toggles dark).
