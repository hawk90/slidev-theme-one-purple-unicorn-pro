---
theme: slidev-theme-one-purple-unicorn-pro
title: {{title}}
author: {{author}}
event: {{event}}
date: '{{date}}'
footer: true
stages: auto
structure: true
# seoMeta:
#   ogUrl: https://example.com/my-talk   # where the slides will be: the QR code on the last slide points there
---

# {{title}}

<!-- The headmatter above shows under the title: title, author, event, date -->

---
layout: intro
---

# Why This Talk

One sentence on what the audience will take home.

---
layout: section
---

# The Problem

---

# What Goes Wrong

- The first point, short
- The second, with **one** word that matters
- The third, and `code` where it helps

<!--
Speaker notes go here: they show in the presenter view (press P) and in the handout.
-->

---
layout: two-cols
leftLabel: Before
rightLabel: After
---

# Before and After

::left::

```cpp
for (int i = 0; i < n; i++)
  out[i * 32] = in[i * 32];
```

::right::

```cpp
for (int i = 0; i < n; i++)
  out[i] = in[i];
```

---
layout: section
---

# The Fix

---

# It Adds Up

<div class="grid grid-cols-3 gap-6 mt-8">
  <Stat value="4×" label="faster" color="green" />
  <Stat value="12.8 → 3.2" label="ms per call" />
  <Stat value="0" label="new dependencies" color="blue" />
</div>

---
layout: end
questions: true
---

# Thank You

<!--
Next steps:
- npx slidev                             present (dev, with hot reload)
- npx one-purple-unicorn-lint slides.md  check layouts and props
- npx slidev export                      PDF
- npx slidev build                       a website, with llms.txt and handout.html
-->
