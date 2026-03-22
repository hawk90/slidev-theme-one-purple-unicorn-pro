---
theme: ../
title: One Purple Unicorn Pro
author: Theme Demo
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
layout: section
---

# Layouts

All 12 built-in layouts

---
layout: default
---

# Default Layout

The basic layout for content slides. Clean and simple.

- Padding and typography are automatically styled
- **Bold text** stands out in yellow
- *Italic text* uses the primary accent color
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
layout: two-cols-header
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

*Footer: This bottom slot also spans both columns.*

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
layout: image-left
image: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800
---

# Image Left

Content appears on the right while an image fills the left half.

- `image` prop sets the URL
- `backgroundSize` prop: `cover` (default), `contain`
- Great for visual storytelling

```yaml
layout: image-left
image: https://example.com/photo.jpg
```

---
layout: image-right
image: https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800
---

# Image Right

Mirror of `image-left` layout.

Content on the left, image on the right.

Same props available:
- `image` (required)
- `backgroundSize` (optional)

---
layout: comparison
leftLabel: Naive
rightLabel: Optimized
---

# Comparison Layout

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
layout: section
---

# Custom Components

PatternCard, StoryBox, ComplexityTable, StageProgress

---

# PatternCard Component

Recognizing algorithm patterns — Signal, Template, and Alternatives.

<PatternCard
  signal="Sorted array + find pair/target → consider two pointers or binary search"
  template="Initialize left=0, right=n-1. Move pointers based on comparison with target."
  alternatives="Hash map O(n) space, brute force O(n²)"
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

# ComplexityTable Component

Default configuration — the classic N-limit quick reference.

<ComplexityTable title="N Limit → Algorithm Cheat Sheet" />

---

# ComplexityTable (Custom)

Pass custom rows to tailor for specific problem domains.

<ComplexityTable
  title="Graph Algorithm Selection"
  :rows="[
    { n: 'V ≤ 20', target: 'O(2^V)', algo: 'Bitmask DP (TSP, Hamiltonian)', complexity: 'O(2^V · V²)', highlight: false },
    { n: 'V ≤ 500', target: 'O(V³)', algo: 'Floyd-Warshall (All-Pairs SP)', complexity: 'O(V³)', highlight: false },
    { n: 'V ≤ 10,000', target: 'O(V·E)', algo: 'Bellman-Ford / SPFA', complexity: 'O(V·E)', highlight: false },
    { n: 'V ≤ 100,000', target: 'O(E log V)', algo: 'Dijkstra + Priority Queue', complexity: 'O((V+E) log V)', highlight: true },
    { n: 'V ≤ 1,000,000', target: 'O(V+E)', algo: 'BFS / DFS / Topological Sort', complexity: 'O(V+E)', highlight: false },
  ]"
/>

---

# Stage Progress Indicator

Add `stages` and `currentStage` to frontmatter. **Click any stage** to jump directly.

```yaml
stages: ["Concept", "Implementation", "Optimization", "Practice"]
currentStage: 1
```

- Green dots = completed, Purple glow = current, Gray = upcoming
- Click any stage → auto-navigates to that slide
- No `stageMap` needed — auto-detects matching slides

---
stages: ["Concept", "Implementation", "Optimization", "Practice"]
currentStage: 0
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
---

# Stage Demo: Optimization

**Optimization** stage — making it faster.

<ComplexityTable
  title="Sorting Comparison"
  :showComplexity="false"
  :rows="[
    { n: 'Small N', target: 'O(N²)', algo: 'Insertion Sort (cache-friendly)', highlight: false },
    { n: 'General', target: 'O(N log N)', algo: 'Merge Sort (stable, guaranteed)', highlight: true },
    { n: 'General', target: 'O(N log N)', algo: 'Quick Sort (faster in practice)', highlight: false },
    { n: 'Integers', target: 'O(N)', algo: 'Counting / Radix Sort', highlight: false },
  ]"
/>

---
stages: ["Concept", "Implementation", "Optimization", "Practice"]
currentStage: 3
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

# Footnote & Badge & LinkCard

Text with references<sup>1</sup> and inline badges: <Badge>Default</Badge> <Badge variant="blue">Blue</Badge> <Badge variant="green">Easy</Badge> <Badge variant="red">Hard</Badge> <Badge variant="yellow">Warning</Badge> <Badge variant="cyan">New</Badge> <Badge variant="gray">Deprecated</Badge>

### Link Cards

<LinkCard href="https://arxiv.org/abs/2301.00001" title="Attention Is All You Need" description="Vaswani et al., 2017 — Transformer architecture" icon="📄" />

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

# Progress Bar Options

The bottom progress bar has 3 modes via frontmatter:

```yaml
progressBar: always   # all slides (default)
progressBar: content  # only where page number shows
progressBar: false    # completely hidden
```

The bar automatically tracks `currentPage / total` with a gradient fill and glow effect.

---
layout: section
---

# Typography & Styling

---

# Typography Showcase

## Heading Level 2

### Heading Level 3

#### Heading Level 4

This is a regular paragraph with **bold text**, *italic text*, and `inline code`. You can also use <mark>highlighted text</mark> for emphasis.

> Blockquotes are styled with a left accent border and subtle background.

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
| **Layouts** | 12 layouts included | All new |
| **Components** | Cards, Alerts, Buttons | CSS classes |

---
layout: section
---

# Code & Syntax

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

```cpp
__global__ void vectorAdd(float *a, float *b, float *c, int n) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < n) {
        c[idx] = a[idx] + b[idx];
    }
}

int main() {
    float *d_a;
    cudaMalloc(&d_a, sizeof(float) * 1024);
    vectorAdd<<<256, 4>>>(d_a, d_b, d_c, 1024);
    cudaDeviceSynchronize();
    cudaFree(d_a);
}
```

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

A gradient beam rotates along the border path. 8 presets + custom CSS variables.

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0.5rem;">
  <div class="anim-border" style="text-align: center; padding: 0.5rem; font-size: 0.8rem;">Purple</div>
  <div class="anim-border anim-border-ocean" style="text-align: center; padding: 0.5rem; font-size: 0.8rem;">Ocean</div>
  <div class="anim-border anim-border-sunset" style="text-align: center; padding: 0.5rem; font-size: 0.8rem;">Sunset</div>
  <div class="anim-border anim-border-neon" style="text-align: center; padding: 0.5rem; font-size: 0.8rem;">Neon</div>
  <div class="anim-border anim-border-fire" style="text-align: center; padding: 0.5rem; font-size: 0.8rem;">Fire</div>
  <div class="anim-border anim-border-ice" style="text-align: center; padding: 0.5rem; font-size: 0.8rem;">Ice</div>
  <div class="anim-border anim-border-mint" style="text-align: center; padding: 0.5rem; font-size: 0.8rem;">Mint</div>
  <div class="anim-border anim-border-gold" style="text-align: center; padding: 0.5rem; font-size: 0.8rem;">Gold</div>
</div>

Direction: `anim-border-ccw` / Speed: `anim-border-slow` (8s) / `anim-border-fast` (2s)

---

# Animated Border — Custom Colors

CSS 변수로 직접 색상 지정 가능:

<div class="anim-border" style="--ab-c1: #ff6b6b; --ab-c2: #ffa500; --ab-c3: #ffd700; --ab-dim: rgba(255,107,107,0.08); margin-bottom: 1rem;">

### Inline Custom

```html
<div class="anim-border"
  style="--ab-c1: #ff6b6b; --ab-c2: #ffa500;
         --ab-c3: #ffd700; --ab-dim: rgba(255,107,107,0.08);">
```

</div>

| 변수 | 역할 |
|---|---|
| `--ab-c1` | 헤드 시작 색상 |
| `--ab-c2` | 헤드 중간 색상 |
| `--ab-c3` | 헤드 끝 색상 |
| `--ab-dim` | 꼬리 (어두운 구간) 색상 |

Speed: `anim-border-slow` (8s) / default (4s) / `anim-border-fast` (2s)

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
  <div class="card anim-glow" style="--glow-color: 255, 107, 107; text-align: center; padding: 0.75rem; border-radius: 0.75rem;">

  **Custom**

  </div>
</div>

Custom: `style="--glow-color: 255, 107, 107; --glow-intensity: 0.6;"`

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

# Gradient Text Animation

<h2 class="anim-gradient-text" style="font-size: 1.5rem;">Rainbow (default)</h2>
<h2 class="anim-gradient-text anim-gradient-text-ocean" style="font-size: 1.5rem;">Ocean</h2>
<h2 class="anim-gradient-text anim-gradient-text-sunset" style="font-size: 1.5rem;">Sunset</h2>
<h2 class="anim-gradient-text anim-gradient-text-fire" style="font-size: 1.5rem;">Fire</h2>
<h2 class="anim-gradient-text anim-gradient-text-neon" style="font-size: 1.5rem;">Neon</h2>

Custom: `style="--gt-c1: #ff6b6b; --gt-c2: #ffa500; ..."`

### Entrance Animations

<div class="anim-fade-up anim-delay-1" style="margin-top: 1rem;">

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

# Float & Cursor Animations

<div style="display: flex; gap: 2rem; align-items: center; margin-bottom: 2rem;">
  <div class="anim-float" style="font-size: 3rem;">🚀</div>
  <div class="anim-bounce" style="font-size: 3rem;">⬇️</div>
  <div style="font-size: 1.5rem; font-family: var(--slidev-theme-font-mono, monospace);">
    <span style="color: var(--one-dark-green);">$</span> npm install<span class="anim-cursor">|</span>
  </div>
</div>

- `anim-float` — gentle up-down floating
- `anim-bounce` — attention-grabbing bounce
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

  3D perspective

  </div>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-top: 1rem;">
  <div class="card hover-glow" style="text-align: center; border-radius: 0.75rem;">

  ### Glow
  `hover-glow`

  </div>
  <div class="card hover-glow-blue" style="text-align: center; border-radius: 0.75rem;">

  ### Blue Glow
  `hover-glow-blue`

  </div>
  <div class="card hover-glow-green" style="text-align: center; border-radius: 0.75rem;">

  ### Green Glow
  `hover-glow-green`

  </div>
</div>

---

# Hover: Shine, Gradient, Border Reveal

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
  <div class="card hover-shine" style="text-align: center;">

  ### Shine
  `hover-shine`

  Light sweep

  </div>
  <div class="card hover-gradient" style="text-align: center; border-radius: 0.75rem;">

  ### Gradient
  `hover-gradient`

  Background fill

  </div>
  <div class="card hover-border" style="text-align: center; border-radius: 0.75rem;">

  ### Border
  `hover-border`

  Gradient border reveal

  </div>
</div>

### Text Hover Effects

<p style="font-size: 1.25rem; margin-top: 1.5rem;">
  <span class="hover-shake" style="display: inline-block; cursor: pointer;">hover-shake</span> — attention-grabbing shake
</p>

<p style="font-size: 1.25rem;">
  <span class="hover-rotate" style="display: inline-block;">hover-rotate</span> — subtle 3° rotation
</p>

링크의 그라디언트 밑줄은 `<a>` 태그에 자동 적용됩니다: [hover to see]()

---

# Hover: Reveal & Combos

<div class="hover-reveal card" style="text-align: center; border-radius: 0.75rem; margin-bottom: 1rem;">

### Blur Reveal
`hover-reveal` — starts blurry, clears on hover. Great for spoilers or progressive disclosure.

</div>

### Combining Effects

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
| `scale-fade` | Zoom in + fade in / Zoom out + fade out |
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

The entering slide scales up from 92% with fade, the leaving slide scales up to 108% with fade.

All transitions:
- Respect `prefers-reduced-motion`
- Disabled automatically in PDF export
- Use `cubic-bezier(0.4, 0, 0.2, 1)` for smooth easing

---
layout: section
---

# CSS Components

Cards, Alerts, Gradients, Buttons

---

# Cards

<div class="card">

### Default Card

Cards have a hover effect with gradient top border animation. Use the `.card` class on any div.

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

# Gradient Text

<h2 class="gradient-text-1" style="-webkit-text-fill-color: transparent;">Gradient Text Style 1 (Blue → Purple → Red)</h2>

<h2 class="gradient-text-2" style="-webkit-text-fill-color: transparent;">Gradient Text Style 2 (Green → Cyan → Blue)</h2>

<h2 class="gradient-text-3" style="-webkit-text-fill-color: transparent;">Gradient Text Style 3 (Yellow → Red → Purple)</h2>

---

# Glass Morphism

<div class="glass-gradient" style="margin-bottom: 1rem;">

### Glass Card

This uses `.glass-gradient` class with backdrop blur and transparent gradient background.

Works best on dark backgrounds.

</div>

<div class="gradient-border">

### Gradient Border

This uses `.gradient-border` class with a gradient outline effect via pseudo-element.

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
<p class="text-lg">Large text (1.25rem)</p>
<p class="text-xl">Extra large (1.5rem)</p>

---
layout: section
---

# PPT-Style Layouts & Full Variants

---
layout: quote
---

The best way to predict the future is to invent it.

**— Alan Kay, 1971**

---
layout: statement
---

# Performance matters more than features.

A fast, simple system will always beat a slow, complex one in the long run.

---
layout: fact
---

## DID YOU KNOW?

# 10x

The performance gap between $O(n)$ and $O(n^2)$ at $n = 10{,}000$

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

<p style="color: #333;">White panel on the right side. Set <code style="color: #c678dd;">panelColor</code> to any value including white.</p>

<ul style="color: #555;">
<li>Corporate style</li>
<li>High contrast text</li>
<li>Works with any background</li>
</ul>

---
layout: section
---

# More Components

Timeline, Countdown, QR Code, Keyboard

---

# Timeline Component

<script setup>
const timelineItems = [
  { year: '1956', title: 'Dijkstra Algorithm', desc: 'Shortest path in weighted graphs' },
  { year: '1960', title: 'QuickSort', desc: 'Tony Hoare — average O(n log n)' },
  { year: '1962', title: 'AVL Trees', desc: 'First self-balancing BST' },
  { year: '1970', title: 'B-Trees', desc: 'Rudolf Bayer — database indexing' },
  { year: '1972', title: 'Red-Black Trees', desc: 'Rudolf Bayer — improved BST' },
]
</script>

<Timeline :active="2" :items="timelineItems" />

---

# Countdown Timer

<Countdown :minutes="5" label="remaining" size="lg" />

Sizes: `sm`, `default`, `lg`, `xl`. Auto-starts by default.

```html
<Countdown :minutes="5" label="remaining" size="lg" />
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

</div>
</div>

---

# Keyboard Shortcuts & Badges

### Keyboard Keys

Press <Kbd>Space</Kbd> or <Kbd>→</Kbd> to advance. Use <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>F</Kbd> for fullscreen.

### Badges in Context

| Algorithm | Time | Space | Difficulty |
|---|---|---|---|
| Binary Search | $O(\log n)$ | $O(1)$ | <Badge variant="green">Easy</Badge> |
| Merge Sort | $O(n \log n)$ | $O(n)$ | <Badge variant="yellow">Medium</Badge> |
| Red-Black Tree | $O(\log n)$ | $O(n)$ | <Badge variant="red">Hard</Badge> |
| FFT | $O(n \log n)$ | $O(n)$ | <Badge variant="red">Hard</Badge> |

---
layout: center
---

### All Layouts & Components

| Type | Name | Key Feature |
|------|------|-------------|
| Layout | `cover`, `intro`, `section`, `end` | Special slides |
| Layout | `default`, `center` | Basic content |
| Layout | `full`, `full-text` | Full bleed variants |
| Layout | `full-image`, `full-split` | Background image + overlay/panel |
| Layout | `two-cols`, `two-cols-header`, `three-cols` | Multi-column |
| Layout | `image-left`, `image-right` | Image + content |
| Layout | `comparison` | Before/After with labels |
| Layout | `quote`, `statement`, `fact` | PPT-style emphasis |
| Layout | `iframe`, `iframe-left`, `iframe-right` | Embedded web content |
| Component | `<PatternCard>` | Signal / Template / Alternatives |
| Component | `<StoryBox>` | History, Tips, Insights sidebar |
| Component | `<ComplexityTable>` | N-limit algorithm reference |
| Component | `<StageProgress>` | Stage indicator (via frontmatter) |
| Component | `<FloatImage>` | Newspaper-style ㄴ-wrap |
| Component | `<Footnote>` | Bottom footnotes with links |
| Component | `<Badge>` | Inline colored badges (7 colors) |
| Component | `<LinkCard>` | Clickable reference cards |
| Component | `<Timeline>` | Vertical timeline with active state |
| Component | `<Countdown>` | Live countdown timer (4 sizes) |
| Component | `<QRCode>` | Auto-generated QR codes |
| Component | `<Kbd>` | Keyboard shortcut keys |
| Component | `<PresenterNote>` | Presenter-only notes |
| Global | Progress Bar | Auto page tracking (3 modes) |
| Animation | `anim-border` | Rotating gradient border (3 colors) |
| Animation | `anim-shimmer` | Light sweep effect |
| Animation | `anim-glow-*` | Pulsing glow (purple, blue) |
| Animation | `anim-gradient-text` | Flowing rainbow text |
| Animation | `anim-fade-*` | Entrance animations (up, left, right) |
| Animation | `anim-pop` | Scale pop entrance |
| Animation | `anim-float` / `anim-bounce` | Floating / bouncing motion |
| Animation | `anim-cursor` | Terminal blinking cursor |
| Hover | `hover-lift/scale/tilt` | Transform-based hover |
| Hover | `hover-glow/glow-blue/glow-green` | Color glow on hover |
| Hover | `hover-shine/gradient/border` | Sweep, fill, border reveal |
| Hover | `hover-shake/rotate` | Text hover effects |
| Hover | `hover-reveal` | Blur → clear on hover |
| Transition | `slide-left/right/up` | Directional slide transitions |
| Transition | `fade`, `scale-fade`, `blur-fade` | Fade-based transitions |

---
layout: end
---

# Thank You!

### Questions?

[GitHub](https://github.com/hawk90/slidev-theme-one-purple-unicorn-pro)
