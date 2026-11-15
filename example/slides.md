---
theme: ../
title: One Purple Unicorn Pro
author: Theme Demo
affiliation: Slidev Theme Lab
event: Slidev Meetup 2026
date: '2026-10-10'
logo: /logo.svg
footer: true
duration: 30min
paceBar: true
highlighter: shiki
layout: cover
---

# One Purple Unicorn Pro

## A Beautiful Theme for Slidev

Professional presentations with purple/indigo gradients and One Dark styling

---
layout: intro
---

# Welcome to the Theme

This is the **intro** layout, designed for opening sections of your presentation.

It uses a dark background with gradient text for visual impact.

---

# Talk Details

Write them once in the headmatter. The first cover shows them under the title, and `footer: true` puts them in the footer line below.

```yaml
---
title: One Purple Unicorn Pro
author: Theme Demo            # or authors: [{ name, affiliation }, ...]
affiliation: Slidev Theme Lab
event: Slidev Meetup 2026
date: '2026-10-10'            # quote dotted dates like '2026.10': YAML reads them as numbers
logo: /logo.svg               # from public/
footer: true                  # or a list: [title, event]
---
```

Title slides and section dividers hide the footer, like the page number.

---
layout: section
---

# Markdown Basics

Typography, lists, tables, and math

---

# Typography Showcase

## Heading Level 2

### Heading Level 3

#### Heading Level 4

This is a regular paragraph with **bold text**, *italic text*, and `inline code`. You can also use <mark>highlighted text</mark> for emphasis.

> Blockquotes are styled with a left accent border and subtle background.

---

# 한국어 타이포그래피

한글은 기본 글꼴인 **Noto Sans KR**로 표시되고, 줄은 단어 사이에서만 바뀝니다 (`word-break: keep-all`).

<div class="grid grid-cols-2 gap-6 mt-6">
<div class="card">

**테마 기본값 (keep-all)**

GPU 메모리 계층을 이해하면 커널의 성능 병목을 정확하게 찾아낼 수 있습니다. 공유 메모리와 레지스터를 적절히 활용하는 것이 최적화의 핵심입니다.

</div>
<div class="card" style="word-break: normal">

**브라우저 기본값 (normal)**

GPU 메모리 계층을 이해하면 커널의 성능 병목을 정확하게 찾아낼 수 있습니다. 공유 메모리와 레지스터를 적절히 활용하는 것이 최적화의 핵심입니다.

</div>
</div>

---

# Lists

- First item in an unordered list
- Second item with some detail
  - Nested item one
  - Nested item two
    - Deeply nested
- Third item

1. First ordered item
2. Second ordered item
3. Third ordered item

Task lists:

- [x] Completed task
- [x] Another done
- [ ] Still pending

---

# Tables

| Feature | Description | Status |
|---------|-------------|--------|
| **Dark Mode** | One Dark Pro color scheme | Supported |
| **Light Mode** | Clean white backgrounds | Supported |
| **Gradients** | Purple/Indigo/Pink | Built-in |
| **Code Blocks** | Shiki syntax highlighting | Configured |
| **Layouts** | 18 layouts | Built-in |
| **Components** | Cards, Alerts, Buttons | CSS classes |

---

# Math Support (KaTeX)

Inline math: $E = mc^2$, complexity $O(n \log n)$, sum $\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$

Display math:

$$
\frac{1}{N} \sum_{i=1}^{N} x_i = \bar{x}
$$

$$
f(x) = \int_{-\infty}^{\infty} \hat{f}(\xi) e^{2\pi i \xi x} \, d\xi
$$

---
layout: section
---

# Layouts

Content layouts: default, center, columns, image, iframe

---
layout: default
---

# Default Layout

The basic layout for content slides. Clean and simple.

- Padding and typography are automatically styled
- **Bold text** stands out (yellow in dark mode)
- *Italic text* uses an accent color
- `inline code` has a subtle background

> Blockquotes get a left border accent and background.

---
layout: center
---

# Center Layout

Content is centered both **vertically** and **horizontally**.

Perfect for emphasis slides, quotes, or key takeaways.

---
layout: two-cols
---

# Two Columns

::left::

## Left Column

Content on the left side.

- Feature A
- Feature B
- Feature C

::right::

## Right Column

Content on the right side.

```python
def hello():
    print("Hello!")
    return 42
```

---
layout: two-cols
leftWidth: 2fr
rightWidth: 1fr
---

# Two Columns (Custom Width)

`leftWidth: 2fr` / `rightWidth: 1fr`

::left::

## Wider Left Column

You can control column widths via frontmatter props. This left column takes 2/3 of the width.

- Flexible grid sizing
- Any CSS grid value works

::right::

## Narrow Right

Sidebar-style content here.

---
layout: two-cols
divider: true
---

# Two Columns with Divider

::left::

## Before

Original implementation with nested loops.

- Time: $O(n^2)$
- Space: $O(1)$

::right::

## After

Optimized with hash map.

- Time: $O(n)$
- Space: $O(n)$

---
layout: two-cols
divider: true
leftLabel: Naive
rightLabel: Optimized
---

# Two Columns with Labels

::left::

```python
# O(n^2) brute force
def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
```

::right::

```python
# O(n) hash map
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
```

---
layout: two-cols
---

# Two Columns with Header

This header spans the full width above both columns.

::left::

### Pros

- Simple and clean
- Easy to maintain
- Great performance
- Well documented

::right::

### Cons

- Limited flexibility
- Requires planning
- More initial setup
- Learning curve

::bottom::

*Bottom slot: this also spans both columns.*

---
layout: three-cols
---

# Three Column Layout

::left::

### Column 1

Basic types:
- `int`
- `float`
- `bool`
- `str`

::center::

### Column 2

Containers:
- `list`
- `dict`
- `tuple`
- `set`

::right::

### Column 3

Advanced:
- `class`
- `enum`
- `generic`
- `protocol`

---
layout: three-cols
leftWidth: 1
centerWidth: 2
rightWidth: 1
divider: true
leftLabel: Input
centerLabel: Kernel
rightLabel: Output
rightLabelColor: var(--one-dark-yellow)
---

# Three Columns with Labels

::left::

Host arrays copied to the device:
- `x`, `y`
- `n = 1 << 20`

::center::

One thread per element, `centerWidth: 2` makes this column twice as wide:

```cpp
__global__ void saxpy(int n, float a, float *x, float *y) {
  int i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i < n) y[i] = a * x[i] + y[i];
}
```

::right::

`y` copied back. Label colors default to blue, green, magenta; `rightLabelColor` sets any CSS color.

::bottom::

`leftWidth` / `centerWidth` / `rightWidth`: a number is a share (`2` = 2fr), anything else a CSS length.

---
layout: image
side: left
image: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800
---

# Image Left

Content appears on the right while an image fills the left half.

- `image` prop sets the URL
- `backgroundSize` prop: `cover` (default), `contain`
- Great for visual storytelling

```yaml
layout: image
side: left
image: https://example.com/photo.jpg
```

---
layout: image
side: right
image: https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800
---

# Image Right

Mirror of the left-side `image` layout (`side: right`).

Content on the left, image on the right.

Same props available:
- `image` (required)
- `backgroundSize` (optional)

---
layout: iframe
side: right
url: https://sli.dev
scale: 0.6
iframeTitle: Slidev documentation
---

# Iframe Beside Content

A live page next to the content. `scale` shrinks it so more of the page fits.

```yaml
layout: iframe
side: right          # left | right | full (default)
url: https://sli.dev
scale: 0.6           # > 0, default 1
iframeTitle: Slidev docs  # screen-reader name
```

Some sites refuse to be embedded (`X-Frame-Options`); those show blank.

---
layout: iframe
url: https://sli.dev
iframeTitle: Slidev documentation
---

---
layout: section
---

# Emphasis & Full-Bleed Layouts

quote, statement, fact, and full variants

---
layout: quote
---

<div style="position: fixed; top: 1.25rem; left: 1.5rem;"><Badge variant="gray">layout: quote</Badge></div>

> The best way to predict the future is to invent it.

**— Alan Kay, 1971**

---
layout: statement
---

<div style="position: fixed; top: 1.25rem; left: 1.5rem;"><Badge variant="gray">layout: statement</Badge></div>

# Performance matters more than features.

A fast, simple system will always beat a slow, complex one in the long run.

---
layout: fact
---

<div style="position: fixed; top: 1.25rem; left: 1.5rem;"><Badge variant="gray">layout: fact</Badge></div>

## DID YOU KNOW?

# 10,000x

The performance gap between $O(n)$ and $O(n^2)$ at $n = 10{,}000$

---
layout: full-dark
---

<div style="position: fixed; top: 1.25rem; left: 1.5rem;"><Badge variant="gray">layout: full-dark</Badge></div>

# Dark in Both Modes

A centered slide with a large heading that stays dark in light mode too, like the title layouts; the page number and progress bar over it turn dark with it. `padding` and `contentMaxWidth` as on `center`.

---
layout: full
---

<div style="background: linear-gradient(135deg, #1a1b2e 0%, #2d1b4e 50%, #1a2744 100%); height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 1rem;">
  <h1 style="font-size: 3rem; color: white;">Full Layout</h1>
  <p style="color: rgba(255,255,255,0.6);">Zero padding — full bleed, DIY everything</p>
</div>

---
layout: full-text
---

# Full Text Layout

This layout gives you the entire slide area for text content — no absolute h1 positioning, no restrictive padding. Just clean, readable typography.

Useful when you have a lot of content that needs to breathe, or when the default content layout's top-fixed h1 doesn't work for your slide structure.

- Lists work naturally
- **Bold** and *italic* are inherited from the theme
- Code blocks: `inline code` works too

---
layout: full-image
image: https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200
---

# Full Image Background

## Text on top of a full-bleed photo

The overlay darkens the image for readability.

---
layout: full-image
image: https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200
overlay: "linear-gradient(135deg, rgba(26,27,46,0.9) 0%, rgba(45,27,78,0.7) 100%)"
---

# Gradient Overlay

## Custom overlay via frontmatter

```yaml
overlay: "linear-gradient(135deg, rgba(26,27,46,0.9), rgba(45,27,78,0.7))"
```

---
layout: full-split
image: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200
panelWidth: 45%
panelSide: left
---

# Split Panel (Left)

Content in a semi-transparent panel over the background image.

- `panelWidth`: 45% (default)
- `panelSide`: left / right
- `panelColor`: any CSS color

---
layout: full-split
image: https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200
panelWidth: 40%
panelSide: right
panelColor: "rgba(255, 255, 255, 0.92)"
---

<h1 style="color: #1a1b2e;">White Panel (Right)</h1>

<p style="color: #333;">White panel on the right side. Set <code>panelColor</code> to any value including white.</p>

<ul style="color: #555;">
<li>Corporate style</li>
<li>High contrast text</li>
<li>Works with any background</li>
</ul>

---
layout: section
---

# CSS Components

Cards, Alerts, Gradients, Buttons

---

# Cards

<div class="card">

### Default Card

Cards lift on hover, with a shadow and a purple border. Use the `.card` class on any div.

</div>

<div class="gradient-card">

### Gradient Card

Uses `.gradient-card` class. Has a permanent gradient accent bar on top.

</div>

---

# Alert Boxes

<div class="alert alert-info">
<strong>Info:</strong> This is an informational alert using <code>.alert .alert-info</code>.
</div>

<div class="alert alert-success">
<strong>Success:</strong> Operation completed successfully using <code>.alert .alert-success</code>.
</div>

<div class="alert alert-warning">
<strong>Warning:</strong> Please review before proceeding using <code>.alert .alert-warning</code>.
</div>

<div class="alert alert-error">
<strong>Error:</strong> Something went wrong using <code>.alert .alert-error</code>.
</div>

---

# Table Variants

<div class="grid grid-cols-2 gap-x-8">
<div>

**Default**

| Kernel | Time | Speedup |
|---|---|---|
| naive | 4.2 ms | 1.0× |
| tiled | 1.1 ms | 3.8× |
| tensor core | 0.3 ms | 14× |

</div>
<div class="table-compact">

**`.table-compact`**

| Kernel | Time | Speedup |
|---|---|---|
| naive | 4.2 ms | 1.0× |
| tiled | 1.1 ms | 3.8× |
| tensor core | 0.3 ms | 14× |

</div>
<div class="table-dense table-auto">

**`.table-dense` + `.table-auto`** (only as wide as the content)

| Kernel | Time | Speedup |
|---|---|---|
| naive | 4.2 ms | 1.0× |
| tiled | 1.1 ms | 3.8× |
| tensor core | 0.3 ms | 14× |

</div>
<div class="table-square">

**`.table-square`** (no rounded corners)

| Kernel | Time | Speedup |
|---|---|---|
| naive | 4.2 ms | 1.0× |
| tiled | 1.1 ms | 3.8× |
| tensor core | 0.3 ms | 14× |

</div>
</div>

---

# Gradient Text

<h2 class="gradient-text-1">Gradient Text Style 1 (Blue → Purple → Red)</h2>

<h2 class="gradient-text-2">Gradient Text Style 2 (Green → Cyan → Blue)</h2>

<h2 class="gradient-text-3">Gradient Text Style 3 (Yellow → Red → Purple)</h2>

---

# Glass Morphism

<div class="glass-gradient" style="margin-bottom: 1rem;">

### Glass Card

This uses `.glass-gradient` class with backdrop blur and transparent gradient background.

Works best on dark backgrounds.

</div>

<div class="gradient-border">

### Gradient Border

This uses `.gradient-border` class: a gradient painted on the element's own border.

</div>

---

# macOS Buttons

<div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
  <button class="btn-macos btn-macos-primary">Primary</button>
  <button class="btn-macos btn-macos-secondary">Secondary</button>
  <button class="btn-macos btn-macos-destructive">Destructive</button>
  <button class="btn-macos btn-macos-success">Success</button>
</div>

<div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
  <button class="btn-macos btn-macos-primary btn-macos-small">Small</button>
  <button class="btn-macos btn-macos-primary">Regular</button>
  <button class="btn-macos btn-macos-primary btn-macos-large">Large</button>
</div>

<div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
  <button class="btn-macos btn-macos-primary btn-macos-rounded">Rounded</button>
  <button class="btn-macos btn-macos-primary btn-macos-capsule">Capsule</button>
  <button class="btn-macos btn-macos-toolbar">Toolbar</button>
</div>

<div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; margin-bottom: 1.5rem;">
  <button class="btn-macos btn-macos-secondary btn-macos-icon" aria-label="Add"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v10M3 8h10"/></svg></button>
  <button class="btn-macos btn-macos-primary btn-macos-loading">Saving</button>
  <code>-icon</code> (an inline SVG) and <code>-loading</code> (a spinner; the label stays for width)
</div>

### Traffic Lights

<div class="macos-traffic-lights">
  <div class="macos-traffic-light close"></div>
  <div class="macos-traffic-light minimize"></div>
  <div class="macos-traffic-light maximize"></div>
</div>

---

# Segmented Control & Utilities

<div class="btn-macos-group" style="margin-bottom: 1.5rem;">
  <button class="btn-macos btn-macos-primary">Day</button>
  <button class="btn-macos">Week</button>
  <button class="btn-macos">Month</button>
</div>

### Grid Utilities

<div class="grid grid-cols-3 gap-4">
  <div class="alert alert-info">Col 1</div>
  <div class="alert alert-success">Col 2</div>
  <div class="alert alert-warning">Col 3</div>
</div>

### Text Sizes

<p class="text-sm">Small text (0.875rem)</p>
<p>Regular text — default</p>
<p class="text-lg">Large text (1.125rem)</p>
<p class="text-xl">Extra large (1.25rem)</p>

---
layout: section
---

# Inline Components

Badge, Kbd, Footnote, LinkCard, FloatImage

---

# Badge & Kbd

Inline badges: <Badge>Default</Badge> <Badge variant="blue">Blue</Badge> <Badge variant="green">Easy</Badge> <Badge variant="red">Hard</Badge> <Badge variant="yellow">Warning</Badge> <Badge variant="cyan">New</Badge> <Badge variant="gray">Deprecated</Badge>

Keyboard keys: Press <Kbd>Space</Kbd> or <Kbd>→</Kbd> to advance. Press <Kbd>F</Kbd> for fullscreen.

### Badges in Context

| Algorithm | Time | Space | Difficulty |
|---|---|---|---|
| Binary Search | $O(\log n)$ | $O(1)$ | <Badge variant="green">Easy</Badge> |
| Merge Sort | $O(n \log n)$ | $O(n)$ | <Badge variant="yellow">Medium</Badge> |
| Red-Black Tree | $O(\log n)$ | $O(n)$ | <Badge variant="red">Hard</Badge> |
| FFT | $O(n \log n)$ | $O(n)$ | <Badge variant="red">Hard</Badge> |

---

# Footnote & LinkCard

Cite a source in the text<sup>1</sup> and list it in a footnote at the bottom of the slide.

### Link Cards

<LinkCard href="https://arxiv.org/abs/1706.03762" title="Attention Is All You Need" description="Vaswani et al., 2017 — Transformer architecture" icon="📄" />

<LinkCard href="https://github.com/slidevjs/slidev" title="Slidev on GitHub" description="Presentation slides for developers" icon="🐙" />

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
  <LinkCard href="https://example.com" title="Compact Mode" icon="⚡" :compact="true" />
  <LinkCard href="https://example.com" title="Compact Mode" icon="📦" :compact="true" />
</div>

<Footnote>

<sup>1</sup> Footnotes appear at the bottom with clickable links — [Vaswani et al. (2017)](https://arxiv.org/abs/1706.03762), [Slidev Docs](https://sli.dev)

</Footnote>

---

# FloatImage Component

<FloatImage
  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400"
  caption="Code on screen"
  position="right"
  width="35%"
/>

Newspaper-style text wrapping around images. The text flows naturally in an **ㄴ-shape** around the floated image.

This is useful when you want to show a diagram or photo alongside explanatory text without splitting into rigid columns.

Props:
- `src` — image URL (required)
- `position` — `right` (default) or `left`
- `width` — image width, e.g. `35%`, `200px`
- `caption` — optional caption text
- `rounded` — border radius (default `true`)

The remaining text continues to fill the space below the image once it runs past the bottom edge.

---

# FloatImage (Left)

<FloatImage
  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400"
  caption="Laptop workspace"
  position="left"
  width="40%"
/>

When `position="left"`, the image floats to the left side and text wraps on the right.

This mirrors the right-float layout and works well for alternating image positions across slides.

You can combine FloatImage with other components like StoryBox or PatternCard — the float context is contained within the slide.

---
layout: section
---

# Content Components

StoryBox, PatternCard, Timeline, ComplexityTable

---

# StoryBox Component

Algorithm history and insight sidebars.

<StoryBox title="Dijkstra's Algorithm" variant="history" year="1956" source="Edsger W. Dijkstra, 'A note on two problems in connexion with graphs'">

**Edsger Dijkstra** invented the algorithm in 20 minutes at a cafe in Amsterdam. He was trying to find the shortest route between Rotterdam and Groningen. The algorithm was published 3 years later in 1959.

</StoryBox>

<StoryBox title="Why not negative weights?" variant="warning">

Dijkstra's greedy approach assumes once a node is finalized, no shorter path exists. **Negative edges** break this invariant. Use **Bellman-Ford** instead.

</StoryBox>

---

# StoryBox Variants

<StoryBox title="Optimization Tip" variant="tip">

For sparse graphs, use an adjacency list + priority queue for $O((V + E) \log V)$ instead of $O(V^2)$ with a matrix.

</StoryBox>

<StoryBox title="Key Insight" variant="insight">

The **amortized cost** of union-find with path compression and union by rank is $O(\alpha(n))$, where $\alpha$ is the inverse Ackermann function — effectively constant.

</StoryBox>

<StoryBox title="Tony Hoare" variant="person" year="1960" source="ACM Turing Award 1980">

Invented **QuickSort** at age 26. Also created the **Hoare partition scheme** and **CSP** (Communicating Sequential Processes).

</StoryBox>

---

# PatternCard Component

Recognizing algorithm patterns — Signal, Template, and Alternatives.

<PatternCard
  signal="Sorted array + find pair/target → consider two pointers or binary search"
  template="Initialize left=0, right=n-1. Move pointers based on comparison with target."
  alternatives="Hash map $O(n)$ space, brute force $O(n^2)$"
/>

<PatternCard
  signal="Shortest path in unweighted graph → BFS"
  template="Queue-based level-order traversal with visited set."
  alternatives="DFS (not shortest), Dijkstra (overkill for unweighted)"
/>

---

# PatternCard with Slots

Use named slots for rich content inside template/alternatives.

<PatternCard signal="Overlapping subproblems + optimal substructure → Dynamic Programming">
  <template #template>

  ```
  dp[i] = max(dp[i-1], dp[i-2] + value[i])
  ```

  Base case: `dp[0] = value[0]`, `dp[1] = max(value[0], value[1])`

  </template>
  <template #alternatives>

  - **Greedy**: Only works if local optimal = global optimal
  - **Brute Force**: $O(2^n)$ — enumerate all subsets

  </template>
</PatternCard>

---

# Timeline Component

<script setup>
const timelineItems = [
  { year: '1956', title: 'Dijkstra Algorithm', desc: 'Shortest path in weighted graphs' },
  { year: '1960', title: 'QuickSort', desc: 'Tony Hoare — average $O(n \\log n)$' },
  { year: '1962', title: 'AVL Trees', desc: 'First self-balancing BST' },
  { year: '1970', title: 'B-Trees', desc: 'Rudolf Bayer — database indexing' },
  { year: '1972', title: 'Red-Black Trees', desc: 'Rudolf Bayer — improved BST' },
]
</script>

<Timeline :active="2" :items="timelineItems" />

---

# Timeline: Entrance and Click Steps

<script setup>
const steps = [
  { year: '1945', title: 'Merge Sort', desc: 'John von Neumann' },
  { year: '1959', title: 'Shell Sort', desc: 'Donald Shell' },
  { year: '1960', title: 'QuickSort', desc: 'Tony Hoare' },
  { year: '1964', title: 'Heapsort', desc: 'J. W. J. Williams' },
]
</script>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;">
<div>

`animate`: top to bottom on arrival

<Timeline animate :items="steps" />

</div>
<div>

`steps`: one item per click

<Timeline steps :items="steps" />

</div>
</div>

---

# ComplexityTable Component

Default configuration — the classic N-limit quick reference.

<ComplexityTable title="N Limit → Algorithm Cheat Sheet" />

---

# ComplexityTable (Custom)

Pass custom rows to tailor for specific problem domains.

<ComplexityTable
  title="Graph Algorithm Selection"
  :rows="[
    { n: '$V \\le 20$', target: '$O(2^V)$', algo: 'Bitmask DP (TSP, Hamiltonian)', complexity: '$O(2^V \\cdot V^2)$', highlight: false },
    { n: '$V \\le 500$', target: '$O(V^3)$', algo: 'Floyd-Warshall (All-Pairs SP)', complexity: '$O(V^3)$', highlight: false },
    { n: '$V \\le 10^4$', target: '$O(V \\cdot E)$', algo: 'Bellman-Ford / SPFA', complexity: '$O(V \\cdot E)$', highlight: false },
    { n: '$V \\le 10^5$', target: '$O(E \\log V)$', algo: 'Dijkstra + Priority Queue', complexity: '$O((V+E) \\log V)$', highlight: true },
    { n: '$V \\le 10^6$', target: '$O(V+E)$', algo: 'BFS / DFS / Topological Sort', complexity: '$O(V+E)$', highlight: false },
  ]"
/>

---
transition: slide-left
---

# Stat Component

A figure, what it is, and how it changed. The arrow follows the delta's sign; `good="down"` for figures that should fall.

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
  <Stat value="98.5%" label="Uptime" delta="+0.3%" />
  <Stat value="1,024" label="Kernels launched" delta="0" color="cyan" />
  <Stat value="42 ms" label="p95 latency" delta="-8 ms" good="down" color="green" />
</div>

```html
<Stat value="98.5%" label="Uptime" delta="+0.3%" />
<Stat value="42 ms" label="p95 latency" delta="-8 ms" good="down" color="green" />
```

---

# Stat: Count-up, Colors, Sizes

<div style="display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 1rem; align-items: stretch;">
  <Stat count value="$4.2M" label="Revenue · count" delta="+18%" size="lg" />
  <Stat count value="12,480" label="Users · count" delta="-2.4%" color="yellow" />
  <Stat count value="3.75x" label="Speedup · count" color="red" />
</div>

<div style="display: flex; gap: 2.5rem; margin-top: 1.25rem;">
  <Stat plain size="sm" value="7" label="primary" />
  <Stat plain size="sm" value="7" label="blue" color="blue" />
  <Stat plain size="sm" value="7" label="cyan" color="cyan" />
  <Stat plain size="sm" value="7" label="green" color="green" />
  <Stat plain size="sm" value="7" label="yellow" color="yellow" />
  <Stat plain size="sm" value="7" label="red" color="red" />
  <Stat plain size="sm" value="7" label="gray" color="gray" />
</div>

`count` counts up once the slide has arrived (here after the previous slide's `slide-left`), again on each visit; exports show the figure. `size`: `sm` · default · `lg`; `plain` drops the card. The color names are the same for every component's `color`.

---

# Numeric Tables

<div class="table-num">

| Kernel | Time (ms) | Bandwidth (GB/s) | Speedup |
|---|---|---|---|
| naive | 12.84 | 186.2 | 1.00x |
| coalesced | 3.17 | 754.9 | 4.05x |
| shared memory | 1.09 | 2,196.4 | 11.78x |

</div>

`.table-num` around a table right-aligns the columns after the first, with digits of one width; `.num` does the same for any text.

---
layout: section
---

# Code

Highlighting, CUDA, and code block chrome

---

# Code Highlighting

## JavaScript

```javascript
const greet = (name) => {
  console.log(`Hello, ${name}!`);
  return `Welcome to Slidev`;
};

export default greet;
```

## Python

```python
def fibonacci(n: int) -> list[int]:
    seq = [0, 1]
    for i in range(2, n):
        seq.append(seq[-1] + seq[-2])
    return seq[:n]
```

---

# CUDA / C++ Code

```cuda
__global__ void vectorAdd(float *a, float *b, float *c, int n) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < n) {
        c[idx] = a[idx] + b[idx];
    }
}

int main() {
    float *d_a, *d_b, *d_c;
    cudaMalloc(&d_a, sizeof(float) * 1024);
    vectorAdd<<<256, 4>>>(d_a, d_b, d_c, 1024);
    cudaDeviceSynchronize();
    cudaFree(d_a);
}
```

---

# Title Bar & Line Numbers

A `[name]` after the language draws a window bar; `{lines:true}` numbers the lines (`lineNumbers: true` in the headmatter does it for every block).

````md
```ts [src/saxpy.ts] {lines:true}
```
````

```ts [src/saxpy.ts] {lines:true}
export function saxpy(a: number, x: Float32Array, y: Float32Array) {
  for (let i = 0; i < x.length; i++) y[i] = a * x[i] + y[i]
  return y
}
```

`{startLine:10}` starts the count elsewhere:

```ts [src/main.ts] {lines:true,startLine:10}
const y = saxpy(2, x, new Float32Array(n))
console.log(y[0])
```

---

# Line Focus

`{1|2-3|4|all}` moves the focus on each click; the other lines dim.

```cpp [saxpy.cu] {1|2-3|4|all}{lines:true}
__global__ void saxpy(int n, float a, const float *x, float *y) {
  int i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i < n)
    y[i] = a * x[i] + y[i];
}
```

````md
```cpp [saxpy.cu] {1|2-3|4|all}{lines:true}
```
````

`--code-dim-opacity` sets how far the other lines fade (0.45).

---
class: code-focus-tint
---

# Line Focus: Tint

`class: code-focus-tint` dims nothing and tints the focused lines instead (`themeConfig: { codeFocus: tint }` for the whole deck).

```cpp [saxpy.cu] {1|2-3|4|all}{lines:true}
__global__ void saxpy(int n, float a, const float *x, float *y) {
  int i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i < n)
    y[i] = a * x[i] + y[i];
}
```

```yaml
---
class: code-focus-tint
---
```

---

# Shell Sessions

In a shell block, prompt lines (`$`, `%`, or a prompt ending in `❯` / `➜`) are commands and the rest is output, shown muted.

```bash
$ nvcc -O3 -arch=sm_90 saxpy.cu \
    -o saxpy
$ ./saxpy | tail -n 2
Max error: 0.000000
Time: 0.31 ms
$ cat > run.sh <<EOF
./saxpy --n 1048576
EOF
```

`[zsh]` makes it a terminal window; Nerd Font icons in a powerline prompt render (exports too):

```bash [zsh]
  ~/cuda  main ❯ nvidia-smi --query-gpu=name --format=csv
name
NVIDIA H100 80GB HBM3
```

---

# Long Lines & Max Height

Long lines wrap under their own code, never a scrollbar:

```ts {lines:true}
const config = { blockSize: 256, gridSize: Math.ceil(n / 256), sharedMemBytes: 48 * 1024, stream: defaultStream, cooperative: false }
launch(saxpyKernel, config)
```

`{maxHeight:'…'}` caps the height and scrolls to the focused lines on each click:

```ts {2|6|10}{maxHeight:'5.5rem',lines:true}
// 1. allocate
const x = new Float32Array(n)
const y = new Float32Array(n)
// 2. fill
x.fill(1)
y.fill(2)
// 3. run
saxpy(2, x, y)
// 4. check
console.assert(y.every(v => v === 4))
```

---

# Magic Move

`magic-move` animates from one block to the next on each click.

````md magic-move {lines:true}
```ts
function saxpy(a, x, y) {
  for (let i = 0; i < x.length; i++) y[i] = a * x[i] + y[i]
}
```

```ts
function saxpy(a: number, x: Float32Array, y: Float32Array) {
  for (let i = 0; i < x.length; i++) y[i] = a * x[i] + y[i]
}
```

```ts
function saxpy(a: number, x: Float32Array, y: Float32Array): Float32Array {
  return y.map((yi, i) => a * x[i] + yi)
}
```
````

`````md
````md magic-move
```ts
function saxpy(a, x, y) { … }
```

```ts
function saxpy(a: number, x: Float32Array, y: Float32Array) { … }
```
````
`````

---
layout: section
---

# Interactive Components

Countdown and QR Code

---

# Countdown Timer

<div style="display: flex; gap: 4rem; align-items: baseline;">
<Countdown :minutes="5" label="remaining" size="lg" />
<Countdown :minutes="3" label="Q&A" size="lg" :auto-start="false" />
</div>

Starts when the slide is shown, or with `:auto-start="false"` on ▶. Click the timer to pause or resume, double-click to reset. Sizes: `sm`, `default`, `lg`, `xl`.

```html
<Countdown :minutes="5" label="remaining" size="lg" />
<Countdown :minutes="3" label="Q&A" size="lg" :auto-start="false" />
```

---

# QR Code

<div style="display: flex; gap: 3rem; align-items: center;">

<QRCode url="https://sli.dev" caption="Slidev Documentation" size="lg" />

<div>

Generate QR codes from any URL. Sizes: `sm`, `default`, `lg`, `xl`.

```html
<QRCode url="https://sli.dev" caption="Slidev Docs" size="lg" />
```

Without `url`: this deck (`:slide="true"`: this slide), from `seoMeta.ogUrl` or a public address. Without either (a dev server), a dashed "No public URL" box stands in; an export leaves it out.

<QRCode :slide="true" caption="This slide" size="sm" />

</div>
</div>

---
layout: section
---

# Progress & Stages

Progress bar options and stage indicator

---

# Progress Bar Options

Set deck-wide options in the headmatter. A slide's own `progressBar`, `pageNumber` or `footer` overrides it for that slide.

```yaml
progressBar: always          # all slides (default)
progressBar: content         # not on title slides and section dividers
progressBar: false           # hidden

progressBarSkip: 2, 5-6      # pages without the bar (list, ranges, or array)
progressBarSkipMode: exclude # hide (default) | exclude: also leave them out of the progress
pageNumber: false            # hide the page number

progressBarInExport: false   # PDF / PNG exports only
pageNumberInExport: false

duration: 30min              # Slidev's talk length (default 30min)
paceBar: true                # a time marker on the bar while the presenter timer runs
```

The bar tracks the current page with a gradient fill and glow effect. This deck sets `paceBar: true`: start the timer in the presenter view and a tick on the bar shows the time used, green on pace, yellow behind, red late.

---
footer: [logo, title, event]
---

# Footer Options

This slide sets its own `footer: [logo, title, event]`: a list picks the fields, in its order.

```yaml
footer: true                # headmatter: title · author · event · date, and the logo
footer: [title, event]      # or a list (logo and affiliation too)
footerInExport: false       # headmatter: leave it out of PDF / PNG exports
```

On one slide, `footer: false` hides it and `true` or a list shows it, even when the deck has none. Title slides and section dividers hide it, like the page number.

---
footer: false
pageNumber: false
progressBar: false
---

# Without Footer, Page Number or Bar

This slide turns all three off in its own frontmatter:

```yaml
footer: false
pageNumber: false
progressBar: false
```

Useful for a full-screen demo or a slide you record on its own.

---
pageNumber: hold
---

# Page Numbers

This slide has `pageNumber: hold`: it shows the previous slide's number and isn't counted.

```yaml
pageNumberFormat: c of t     # headmatter: c/t (default, "3 / 12") | c ("3") | c of t ("3 of 12")

pageNumber: skip             # a slide: no number, and it isn't counted
pageNumber: hold             # a slide: the last number again, not counted (a build-up in steps)
appendix: true               # the first appendix slide: from here on A1, A2…, the total stays
```

The slide after **Thank You!** starts the appendix: it shows **A1**, and every page before it counts to the frozen total.

---

# Stage Progress Indicator

Add `stages` and `currentStage` to frontmatter. **Click any stage** to jump directly.

```yaml
stages: ["Concept", "Implementation", "Optimization", "Practice"]
currentStage: 1
stagePosition: top-right   # top (default) | top-left | top-right | bottom | left | right
stageMap: [concept, impl, opt, practice] # optional: routeAlias (or page) per stage
```

- Green dots = completed, Purple glow = current, Gray = upcoming
- Click any stage → auto-navigates to that slide
- Without `stageMap`, a click jumps to the first slide with the same `stages` and that `currentStage` (usually all you need)

---
stages: ["Concept", "Implementation", "Optimization", "Practice"]
currentStage: 0
routeAlias: concept
---

# Stage Demo: Concept

This is the **Concept** stage — the first step in understanding the algorithm.

- Define the problem
- Identify the pattern
- Sketch the approach

<StoryBox title="Why start with concepts?" variant="insight">

Understanding the *why* before the *how* leads to better retention and flexible application to new problems.

</StoryBox>

---
stages: ["Concept", "Implementation", "Optimization", "Practice"]
currentStage: 1
routeAlias: impl
---

# Stage Demo: Implementation

Now we're in the **Implementation** stage.

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)
```

<PatternCard
  signal="Divide array into halves recursively → Merge Sort"
  template="Split → Recurse → Merge sorted halves"
  alternatives="Quick Sort (in-place), Tim Sort (hybrid)"
/>

---
stages: ["Concept", "Implementation", "Optimization", "Practice"]
currentStage: 2
routeAlias: opt
---

# Stage Demo: Optimization

**Optimization** stage — making it faster.

<ComplexityTable
  title="Sorting Comparison"
  :showComplexity="false"
  :rows="[
    { n: 'Small N', target: '$O(N^2)$', algo: 'Insertion Sort (cache-friendly)', highlight: false },
    { n: 'General', target: '$O(N \\log N)$', algo: 'Merge Sort (stable, guaranteed)', highlight: true },
    { n: 'General', target: '$O(N \\log N)$', algo: 'Quick Sort (faster in practice)', highlight: false },
    { n: 'Integers', target: '$O(N)$', algo: 'Counting / Radix Sort', highlight: false },
  ]"
/>

---
stages: ["Concept", "Implementation", "Optimization", "Practice"]
currentStage: 3
routeAlias: practice
---

# Stage Demo: Practice

Final stage — **Practice** problems.

| Problem | Difficulty | Pattern |
|---------|-----------|---------|
| Merge Intervals | Medium | Sort + Merge |
| Count Inversions | Hard | Merge Sort variant |
| Median of Two Sorted Arrays | Hard | Binary Search + Merge logic |

<StoryBox title="Deliberate Practice" variant="tip">

Solve at least 3 problems per pattern. Vary the constraints — different sizes, edge cases, follow-up questions.

</StoryBox>

---
stages: auto
---

# Automatic Sections

`stages: auto` builds the stages from the deck's `layout: section` slides, so no slide lists them. This deck has 11 sections: with more than 6, only the current one is labelled. Hover a dot for its name; click it to go to that section.

```yaml
stages: auto           # headmatter: every slide (a slide's own stages list wins; stages: false turns it off)
stageLabels: active    # all | active | hover (a dot rail: names on hover only)
stagePosition: top     # as for a stages list; in the headmatter it is the deck's default
```

- A slide with `chapter: "Name"` starts a section too, and `chapter: false` leaves a section slide out.
- Slides before the first section show every dot upcoming.

---
stages: auto
stagePosition: right
stageLabels: hover
---

# Section Rail

The same sections as a dot rail on the right: `stagePosition: right` with `stageLabels: hover`. Each dot names its section on hover or keyboard focus.

The content's right padding grows by the rail's column, as for the stage indicator at `right`.

---
aside: true
---

# Deep-Dive Slides

`aside: true` marks a slide the audience can skip: an accent rail on the left edge and a **Deep dive** tag in the corner.

```yaml
aside: true              # tag "Deep dive"
aside: "Under the hood"  # or your own label
```

Use it for proofs, benchmarks and internals: the room sees at once that the main thread resumes after it.

---
aside: Under the hood
class: slide-dark
---

# Deep Dive on a Dark Slide

`aside: "Under the hood"` gives the tag its own text. Over a dark slide the rail and tag keep the dark palette, like the rest of the chrome.

---
confidential:
  label: CONFIDENTIAL
  company: ACME Corp
stages: ["Draft", "Review", "Final"]
currentStage: 1
stagePosition: top-right
---

# Confidential Ribbon

A red band across the corner, in exports too: leaked files are the point. Set it once in the headmatter for the whole deck.

```yaml
confidential: true                 # "CONFIDENTIAL", top-right
confidential: 대외비                # any label
confidential:
  label: CONFIDENTIAL
  company: ACME Corp               # a smaller second line
  position: top-left               # top-right (default) | top-left
confidentialOn: openers            # all (default) | openers: cover, intro, section, end
```

On a slide, `confidential: false` hides it and its own value shows it (this slide sets its own). A top-right stage indicator, as here, moves aside.

---
confidential:
  label: 대외비
  company: Slidev Theme Lab · Platform Engineering
  position: top-left
class: slide-dark
---

# Ribbon on a Dark Slide

`position: top-left`, a Korean label, and a long company name that shrinks, then ends in "…". Over a dark slide the band takes the dark palette's red with dark text; in light mode it is a deeper red with white text (both above 5:1).

---
hotkey: k
---

# Slide Hotkeys

`hotkey:` on a slide makes a key jump to it from anywhere in the deck. Try it: <Kbd>q</Kbd> goes to **Thank You!**, <Kbd>a</Kbd> to the appendix, <Kbd>k</Kbd> back here.

```yaml
hotkey: q          # one key
hotkey: shift+a    # with modifiers: ctrl, alt, shift, meta
```

Slidev's own keys (<Kbd>space</Kbd>, arrows, <Kbd>d</Kbd>, <Kbd>o</Kbd>, <Kbd>g</Kbd>, <Kbd>f</Kbd>…) are kept: a hotkey on one of them, a key used twice or a value that isn't a key is reported in the console. Keys do nothing while typing in a field.

---
layout: section
---

# Animations

v-click, Transitions, Gradient Borders, Shimmer, Glow, and more

---

# v-click Animations

<v-click>

**Step 1:** First, we define the problem.

</v-click>

<v-click>

**Step 2:** Then, we analyze the constraints.

</v-click>

<v-click>

**Step 3:** Finally, we implement the solution.

</v-click>

<v-click>

> Each block appears one by one on click or arrow key.

</v-click>

<div v-click class="anim-pop">

**Step 4:** `v-click` + `anim-pop` pops in instead of fading.

</div>

---

# v-click on Lists

- Item always visible

<v-clicks>

- First click reveals this
- Second click reveals this
- Third click reveals this
- Fourth click reveals this

</v-clicks>

---

# Animated Gradient Border

A light runs along the border at a constant speed. The default and 7 color presets:

<div class="ab-demo" style="grid-template-columns: repeat(4, 1fr);">
  <div class="anim-border"><b>Default</b><code>anim-border</code></div>
  <div class="anim-border anim-border-ocean"><b>Ocean</b><code>-ocean</code></div>
  <div class="anim-border anim-border-sunset"><b>Sunset</b><code>-sunset</code></div>
  <div class="anim-border anim-border-neon"><b>Neon</b><code>-neon</code></div>
  <div class="anim-border anim-border-fire"><b>Fire</b><code>-fire</code></div>
  <div class="anim-border anim-border-ice"><b>Ice</b><code>-ice</code></div>
  <div class="anim-border anim-border-mint"><b>Mint</b><code>-mint</code></div>
  <div class="anim-border anim-border-gold"><b>Gold</b><code>-gold</code></div>
</div>

<style>
.ab-demo { display: grid; gap: 1rem; }
.ab-demo .anim-border { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 0.35rem; min-height: 6.5rem; padding: 0.75rem; }
.ab-demo b { font-size: 0.9rem; }
.ab-demo code { font-size: 0.7rem; }
</style>

---

# Animated Border — Direction and Speed

One lap of a 600px border takes 6s by default. The options combine with the colors and with each other.

<div class="ab-demo" style="grid-template-columns: repeat(3, 1fr);">
  <div class="anim-border"><b>Clockwise</b><code>default</code></div>
  <div class="anim-border anim-border-ccw"><b>Counter-clockwise</b><code>-ccw</code></div>
  <div class="anim-border anim-border-ccw anim-border-fast anim-border-sunset"><b>Combined</b><code>-ccw -fast -sunset</code></div>
  <div class="anim-border anim-border-slow"><b>Slow · 10s</b><code>-slow</code></div>
  <div class="anim-border"><b>Default · 6s</b><code>default</code></div>
  <div class="anim-border anim-border-fast"><b>Fast · 3s</b><code>-fast</code></div>
</div>

<style>
.ab-demo { display: grid; gap: 1rem; }
.ab-demo .anim-border { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 0.35rem; min-height: 6.5rem; padding: 0.75rem; }
.ab-demo b { font-size: 0.9rem; }
.ab-demo code { font-size: 0.7rem; }
</style>

---

# Animated Border — Width and Length

The ring is 2px by default; the light is 90px long, at most 3/4 of the box height.

<div class="ab-demo" style="grid-template-columns: repeat(3, 1fr);">
  <div class="anim-border anim-border-thin"><b>Thin · 1px</b><code>-thin</code></div>
  <div class="anim-border"><b>Default · 2px</b><code>default</code></div>
  <div class="anim-border anim-border-thick"><b>Thick · 4px</b><code>-thick</code></div>
  <div class="anim-border anim-border-short ab-tall"><b>Short · 45px</b><code>-short</code></div>
  <div class="anim-border ab-tall"><b>Default · 90px</b><code>default</code></div>
  <div class="anim-border anim-border-long ab-tall"><b>Long · 140px</b><code>-long</code></div>
</div>

<style>
.ab-demo { display: grid; gap: 1rem; }
.ab-demo .anim-border { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 0.35rem; min-height: 5rem; padding: 0.75rem; }
.ab-demo .ab-tall { min-height: 12rem; }
.ab-demo b { font-size: 0.9rem; }
.ab-demo code { font-size: 0.7rem; }
</style>

---

# Animated Border — Custom Colors

Set the colors directly with CSS variables:

<div class="anim-border" style="--ab-c1: #ff6b6b; --ab-c2: #ffa500; --ab-c3: #ffd700; margin-bottom: 1rem;">

### Inline Custom

```html
<div class="anim-border"
  style="--ab-c1: #ff6b6b; --ab-c2: #ffa500;
         --ab-c3: #ffd700;">
```

</div>

| Variable | Role |
|---|---|
| `--ab-c1` | Light head color |
| `--ab-c2` | Light middle color |
| `--ab-c3` | Light tail color |
| `--ab-dim` | Resting border color (optional; defaults to a faint `--ab-c1`) |
| `--ab-width` · `--ab-len` · `--ab-duration` | Ring width · light length · one lap of a 600px border |

---

# Shimmer Directions

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem;">
  <div class="card anim-shimmer" style="text-align: center; padding: 0.75rem;">

  **→ Left to Right**
  default

  </div>
  <div class="card anim-shimmer anim-shimmer-right" style="text-align: center; padding: 0.75rem;">

  **← Right to Left**
  `anim-shimmer-right`

  </div>
  <div class="card anim-shimmer anim-shimmer-down" style="text-align: center; padding: 0.75rem;">

  **↓ Top to Bottom**
  `anim-shimmer-down`

  </div>
  <div class="card anim-shimmer anim-shimmer-up" style="text-align: center; padding: 0.75rem;">

  **↑ Bottom to Top**
  `anim-shimmer-up`

  </div>
  <div class="card anim-shimmer anim-shimmer-diag" style="text-align: center; padding: 0.75rem;">

  **↘ Diagonal**
  `anim-shimmer-diag`

  </div>
  <div class="card anim-shimmer anim-shimmer-purple" style="text-align: center; padding: 0.75rem;">

  **Purple tint**
  `anim-shimmer-purple`

  </div>
  <div class="card anim-shimmer anim-shimmer-blue" style="text-align: center; padding: 0.75rem;">

  **Blue tint**
  `anim-shimmer-blue`

  </div>
  <div class="card anim-shimmer anim-shimmer-green" style="text-align: center; padding: 0.75rem;">

  **Green tint**
  `anim-shimmer-green`

  </div>
  <div class="card anim-shimmer anim-shimmer-warm" style="text-align: center; padding: 0.75rem;">

  **Warm tint**
  `anim-shimmer-warm`

  </div>
</div>

---

# Glow Pulse Presets

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem;">
  <div class="card anim-glow anim-glow-purple" style="text-align: center; padding: 0.75rem; border-radius: 0.75rem;">

  **Purple**

  </div>
  <div class="card anim-glow anim-glow-blue" style="text-align: center; padding: 0.75rem; border-radius: 0.75rem;">

  **Blue**

  </div>
  <div class="card anim-glow anim-glow-green" style="text-align: center; padding: 0.75rem; border-radius: 0.75rem;">

  **Green**

  </div>
  <div class="card anim-glow anim-glow-red" style="text-align: center; padding: 0.75rem; border-radius: 0.75rem;">

  **Red**

  </div>
  <div class="card anim-glow anim-glow-cyan" style="text-align: center; padding: 0.75rem; border-radius: 0.75rem;">

  **Cyan**

  </div>
  <div class="card anim-glow anim-glow-gold" style="text-align: center; padding: 0.75rem; border-radius: 0.75rem;">

  **Gold**

  </div>
  <div class="card anim-glow anim-glow-neon" style="text-align: center; padding: 0.75rem; border-radius: 0.75rem;">

  **Neon**

  </div>
  <div class="card anim-glow" style="--glow: #ff6b6b; text-align: center; padding: 0.75rem; border-radius: 0.75rem;">

  **Custom**

  </div>
</div>

Custom: `style="--glow: #ff6b6b; --glow-intensity: 0.6;"` (any CSS color)

---

# Combinations

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
  <div class="anim-border anim-border-neon anim-shimmer anim-shimmer-neon">

  ### Border + Shimmer
  `anim-border-neon anim-shimmer anim-shimmer-neon`

  </div>
  <div class="anim-border anim-border-fire anim-glow anim-glow-red">

  ### Border + Glow
  `anim-border-fire anim-glow anim-glow-red`

  </div>
</div>

<div class="anim-border anim-border-ice anim-shimmer anim-shimmer-diag anim-glow anim-glow-cyan" style="margin-top: 1rem;">

### Triple Stack
`anim-border-ice` + `anim-shimmer-diag` + `anim-glow-cyan` — all three combined

</div>

---
transition: slide-left
---

# Gradient Text Animation

<h2 class="anim-gradient-text" style="font-size: 1.5rem;">Rainbow (default)</h2>
<h2 class="anim-gradient-text anim-gradient-text-ocean" style="font-size: 1.5rem;">Ocean</h2>
<h2 class="anim-gradient-text anim-gradient-text-sunset" style="font-size: 1.5rem;">Sunset</h2>
<h2 class="anim-gradient-text anim-gradient-text-fire" style="font-size: 1.5rem;">Fire</h2>
<h2 class="anim-gradient-text anim-gradient-text-neon" style="font-size: 1.5rem;">Neon</h2>

Custom: `style="--gt-c1: #ff6b6b; --gt-c2: #ffa500; ..."`

---

# Entrance Animations

One-shot entrances; add `anim-delay-1` … `-5` to stagger them. They start once the slide has arrived: the previous slide sets `transition: slide-left`, and they wait for it to stop. They replay each time you come back.

<div class="anim-fade-in" style="margin-top: 1rem;">

**Fade In** (no delay) — `anim-fade-in`

</div>

<div class="anim-fade-up anim-delay-1">

**Fade Up** (delay 0.1s) — `anim-fade-up anim-delay-1`

</div>

<div class="anim-fade-left anim-delay-2">

**Fade Left** (delay 0.2s) — `anim-fade-left anim-delay-2`

</div>

<div class="anim-fade-right anim-delay-3">

**Fade Right** (delay 0.3s) — `anim-fade-right anim-delay-3`

</div>

<div class="anim-pop anim-delay-4">

**Scale Pop** (delay 0.4s) — `anim-pop anim-delay-4`

</div>

---

# Speed Variants

Border, shimmer, glow and gradient text have `-slow` and `-fast` presets (e.g. `anim-glow anim-glow-fast`), or set the `--*-duration` variable. `anim-border-ccw` turns the border light the other way.

<div style="display:grid;grid-template-columns:7rem repeat(4,1fr);gap:0.75rem;align-items:center;align-content:start;font-size:0.7rem;margin-top:1rem">
<div></div><div style="text-align:center">slow</div><div style="text-align:center">default</div><div style="text-align:center">fast</div><div style="text-align:center">reverse</div>
<div><strong>Border</strong></div>
<div class="card anim-border anim-border-slow" style="text-align:center;padding:0.5rem"><code>anim-border-slow</code></div>
<div class="card anim-border" style="text-align:center;padding:0.5rem"><code>anim-border</code></div>
<div class="card anim-border anim-border-fast" style="text-align:center;padding:0.5rem"><code>anim-border-fast</code></div>
<div class="card anim-border anim-border-ccw" style="text-align:center;padding:0.5rem"><code>anim-border-ccw</code></div>
<div><strong>Shimmer</strong></div>
<div class="card anim-shimmer anim-shimmer-slow" style="text-align:center;padding:0.5rem"><code>anim-shimmer-slow</code></div>
<div class="card anim-shimmer" style="text-align:center;padding:0.5rem"><code>anim-shimmer</code></div>
<div class="card anim-shimmer anim-shimmer-fast" style="text-align:center;padding:0.5rem"><code>anim-shimmer-fast</code></div>
<div></div>
<div><strong>Glow</strong></div>
<div class="card anim-glow anim-glow-slow" style="text-align:center;padding:0.5rem"><code>anim-glow-slow</code></div>
<div class="card anim-glow" style="text-align:center;padding:0.5rem"><code>anim-glow</code></div>
<div class="card anim-glow anim-glow-fast" style="text-align:center;padding:0.5rem"><code>anim-glow-fast</code></div>
<div></div>
<div><strong>Gradient text</strong></div>
<div style="text-align:center"><span class="anim-gradient-text anim-gradient-text-slow" style="font-size:1.4rem;font-weight:800">Aa</span> <code>anim-gradient-text-slow</code></div>
<div style="text-align:center"><span class="anim-gradient-text" style="font-size:1.4rem;font-weight:800">Aa</span> <code>anim-gradient-text</code></div>
<div style="text-align:center"><span class="anim-gradient-text anim-gradient-text-fast" style="font-size:1.4rem;font-weight:800">Aa</span> <code>anim-gradient-text-fast</code></div>
<div></div>
</div>

---

# Float & Cursor Animations

<div style="display: flex; gap: 2rem; align-items: center; margin-bottom: 2rem;">
  <div class="anim-float" style="font-size: 3rem;">🚀</div>
  <div style="font-size: 1.5rem; font-family: var(--font-mono);">
    <span style="color: var(--one-dark-green);">$</span> npm install<span class="anim-cursor">|</span>
  </div>
</div>

- `anim-float` — gentle up-down floating
- `anim-cursor` — terminal-style blinking cursor

### Staggered Delays

```
anim-delay-1  →  0.1s
anim-delay-2  →  0.2s
anim-delay-3  →  0.3s
anim-delay-4  →  0.4s
anim-delay-5  →  0.5s
```

Combine with any entrance animation for cascading reveals.

---

# Hover: Lift, Scale, Tilt

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
  <div class="card hover-lift" style="text-align: center;">

  ### Lift
  `hover-lift`

  Rises with shadow

  </div>
  <div class="card hover-scale" style="text-align: center;">

  ### Scale
  `hover-scale`

  Subtle grow

  </div>
  <div class="card hover-tilt" style="text-align: center;">

  ### Tilt
  `hover-tilt`

  3D tilt toward you

  </div>
</div>

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1rem;">
  <div class="card hover-glow glow-demo" style="text-align: center; border-radius: 0.75rem;">

  ### Glow
  `hover-glow`

  </div>
  <div class="card hover-glow hover-glow-blue glow-demo" style="text-align: center; border-radius: 0.75rem;">

  ### Blue
  `hover-glow-blue`

  </div>
  <div class="card hover-glow hover-glow-red glow-demo" style="text-align: center; border-radius: 0.75rem;">

  ### Red
  `hover-glow-red`

  </div>
  <div class="card hover-glow hover-glow-gold glow-demo" style="text-align: center; border-radius: 0.75rem;">

  ### Gold
  `hover-glow-gold`

  </div>
</div>

<style>
/* Demo only: a faint resting glow, so the colors show without hovering (and in exports) */
.glow-demo:not(:hover) { box-shadow: 0 0 10px color-mix(in srgb, var(--hover-glow, var(--one-dark-magenta)) 30%, transparent); }
</style>

Glow colors as `anim-glow`'s (`hover-glow-red` alone works too); `--hover-glow` takes any color.

---

# Hover: Shine, Gradient, Border Reveal

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
  <div class="card hover-shine" style="text-align: center;">

  ### Shine
  `hover-shine`

  Light sweep

  </div>
  <div class="card hover-gradient" style="text-align: center;">

  ### Gradient
  `hover-gradient`

  Soft gradient fill

  </div>
  <div class="card hover-border" style="text-align: center; border-radius: 0.75rem;">

  ### Border
  `hover-border`

  Gradient border reveal

  </div>
</div>

Links get a gradient underline on hover automatically: [hover to see](https://sli.dev)

---

# Hover: Combinations

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
  <div class="anim-border hover-scale" style="text-align: center;">

  ### Border + Scale
  `anim-border hover-scale`

  Animated border + hover grow

  </div>
  <div class="card anim-shimmer hover-lift" style="text-align: center;">

  ### Shimmer + Lift
  `card anim-shimmer hover-lift`

  Shimmer sweep + hover rise

  </div>
</div>

---
transition: slide-left
---

# Slide Transitions

This slide uses `transition: slide-left` in frontmatter.

Available transitions:

| Transition | Effect |
|---|---|
| `slide-left` | Slide in from right, out to left |
| `slide-right` | Slide in from left, out to right |
| `slide-up` | Slide in from bottom, out to top |
| `fade` | Simple crossfade |
| `scale-fade` | Grows in from 95% / grows to 105% and fades out |
| `blur-fade` | Blur + fade + scale |

```yaml
---
transition: blur-fade
---
```

---
transition: scale-fade
---

# Scale Fade Transition

This slide uses `transition: scale-fade`.

The entering slide scales up from 95% with fade, the leaving slide scales up to 105% with fade.

All transitions:
- Respect `prefers-reduced-motion`
- Disabled automatically in PDF export
- All but `fade` use `cubic-bezier(0.4, 0, 0.2, 1)` easing

---
transition: slide-right
---

# Transition: slide-right

This slide sets `transition: slide-right`. Slidev plays a slide's transition between it and the next slide (reversed going back): press → and the next slide comes in from the left.

---
transition: slide-up
---

# Transition: slide-up

This slide sets `transition: slide-up`. Slidev plays a slide's transition between it and the next slide (reversed going back): press → and the next slide comes in from the bottom.

---
transition: fade
---

# Transition: fade

This slide sets `transition: fade`. Slidev plays a slide's transition between it and the next slide (reversed going back): press → and the next slide crossfades in.

---
layout: section
---

# Customization

Brand colors, color modes, fonts, and CSS variables

---

# Brand Colors

Set one color in the headmatter; the theme derives the scale, the gradient partner and the light-mode shades.

```yaml
themeConfig:
  primary: '#0ea5e9'     # quote it: an unquoted # starts a YAML comment
  secondary: '#a78bfa'   # optional; picked from primary when left out
  accents:               # optional: blue, cyan, green, yellow, red
    green: '#22c55e'
```

This deck sets none, so these are the theme's defaults, as the current mode resolves them (light mode deepens 300–600, the text shades, for white):

<div style="display:flex;gap:0.35rem;margin-top:0.5rem;font-size:0.65rem;text-align:center">
<div v-for="t in ['primary-100','primary-300','primary-400','primary-500','primary-600','primary-700','primary-800','primary-900','secondary-400']" :key="t" style="flex:1">
<div :style="{ background: `var(--${t})`, height: '2.2rem', borderRadius: '0.4rem', border: '1px solid var(--border-default)' }" />
<code>{{ t }}</code>
</div>
</div>

<div style="display:flex;gap:0.35rem;margin-top:0.5rem;font-size:0.65rem;text-align:center">
<div v-for="t in ['blue','cyan','green','yellow','red','magenta']" :key="t" style="flex:1">
<div :style="{ background: `var(--one-dark-${t})`, height: '1.6rem', borderRadius: '0.4rem' }" />
<code>{{ t }}</code>
</div>
</div>

---

# Color Modes & Fonts

```yaml
colorSchema: auto        # auto (default: follows the system / toggle) | light | dark
fonts:
  sans: Pretendard       # web font names only (Slidev loads them from Google Fonts)
  mono: D2Coding
  weights: '400,700'     # the theme loads 400 only by default
```

- Title and emphasis layouts (`cover`, `section`, `quote`, `statement`, `fact`, `full-image`, …) and code blocks stay dark in both modes
- `class: slide-dark` keeps any other slide dark too
- Defaults: Noto Sans KR / Inter (sans), Noto Serif KR (serif), JetBrains Mono / Fira Code (mono)

---

# CSS Variables

Every size and color has a variable: set it inline on one element, or on `:root` in your deck's `styles/index.css`.

<div class="grid grid-cols-2 gap-6 mt-2" style="--grid-padding-x: 0">
<div class="card">

Default card (hover it)

</div>
<div class="card" style="--card-radius: 0; --card-hover-lift: 12px">

`--card-radius: 0; --card-hover-lift: 12px` (hover it)

</div>
</div>

```css
/* styles/index.css in your deck */
:root {
  --hover-lift: 8px;
  --table-radius: 0;
  --code-dim-opacity: 0.3;
}
```

The README's *Customization* section lists them per slide part, component and effect.

---

# Summary: Layouts

| Name | Key Feature |
|------|-------------|
| `cover`, `intro`, `section`, `end` | Special slides |
| `default`, `center` | Basic content |
| `full`, `full-text` | Full bleed variants |
| `full-image`, `full-split` | Background image + overlay/panel |
| `two-cols`, `three-cols` | Multi-column (divider, labels) |
| `image` | Image + content (side: left/right) |
| `quote`, `statement`, `fact` | PPT-style emphasis |
| `iframe` | Embed (side: full/left/right) |

---
layout: two-cols
leftLabel: Inline & Slide
rightLabel: Content
---

# Summary: Components

::left::

| Name | Key Feature |
|------|-------------|
| Stage indicator | `stages` / `currentStage` frontmatter (no tag) |
| `<FloatImage>` | Newspaper-style ㄴ-wrap |
| `<Footnote>` | Bottom footnotes with links |
| `<Badge>` | Inline colored badges (7 colors) |
| `<LinkCard>` | Clickable reference cards |
| `<Kbd>` | Keyboard shortcut keys |
| Progress Bar | Page tracking (3 modes + skip pages) |

::right::

| Name | Key Feature |
|------|-------------|
| `<PatternCard>` | Signal / Template / Alternatives |
| `<StoryBox>` | History, Tips, Insights sidebar |
| `<ComplexityTable>` | N-limit algorithm reference |
| `<Timeline>` | Vertical timeline with active state |
| `<Countdown>` | Live countdown timer (4 sizes) |
| `<QRCode>` | Auto-generated QR codes |
| `<PresenterNote>` | Presenter-only notes |

---
layout: two-cols
leftLabel: Animation
rightLabel: Hover & Transition
---

# Summary: Animations & Effects

::left::

| Name | Key Feature |
|------|-------------|
| `anim-border` | Rotating gradient border (3 colors) |
| `anim-shimmer` | Light sweep effect |
| `anim-glow-*` | Pulsing glow (purple, blue, green, red, cyan, gold, neon) |
| `anim-gradient-text` | Flowing rainbow text |
| `anim-fade-*` | Entrance animations (in, up, left, right) |
| `anim-pop` | Scale pop entrance |
| `anim-float` | Gentle floating motion |
| `anim-cursor` | Terminal blinking cursor |

::right::

| Name | Key Feature |
|------|-------------|
| `hover-lift/scale/tilt` | Transform-based hover |
| `hover-glow-*` | Glow on hover (purple, blue, green, red, cyan, gold, neon) |
| `hover-shine/gradient/border` | Sweep, fill, border reveal |
| `slide-left/right/up/down` | Short directional slides |
| `fade`, `scale-fade`, `blur-fade` | Fade-based transitions |

---
layout: end
hotkey: q
---

# Thank You!

### Questions?

[GitHub](https://github.com/hawk90/slidev-theme-one-purple-unicorn-pro)

---
appendix: true
hotkey: a
---

# Appendix: Extra Material

`appendix: true` here starts the appendix: this page is **A1**, and the total on the pages before stays the count of the main part.

Backup slides for questions go here, after the closing slide, without changing the numbers the audience saw.
