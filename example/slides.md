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

# Typography & Text

---

# Typography Showcase

## Heading Level 2

### Heading Level 3

#### Heading Level 4

This is a regular paragraph with **bold text**, *italic text*, and `inline code`. You can mix and match these styles freely.

> This is a blockquote for highlighting important information or quotes.

---

# Lists

- First item in an unordered list
- Second item with some detail
  - Nested item one
  - Nested item two
- Third item

1. First ordered item
2. Second ordered item
3. Third ordered item

---

# Code Examples

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

# Tables

| Feature | Description | Status |
|---------|-------------|--------|
| **Dark Mode** | One Dark Pro color scheme | Supported |
| **Light Mode** | Clean white backgrounds | Supported |
| **Gradients** | Purple/Indigo/Pink | Built-in |
| **Code Blocks** | Shiki syntax highlighting | Configured |
| **Layouts** | Cover, Intro, Section, End | Included |

---
layout: two-cols
---

# Two Column Layout

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
    print("Hello, World!")
    return 42
```

---
layout: section
---

# More Examples

---

# CUDA Code

```cpp
__global__ void vectorAdd(float *a, float *b, float *c, int n) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < n) {
        c[idx] = a[idx] + b[idx];
    }
}
```

---

# Math Support

Inline math: $E = mc^2$

Display math:

$$
\frac{1}{N} \sum_{i=1}^{N} x_i = \bar{x}
$$

---
layout: end
---

# Thank You!

### Questions?

[GitHub](https://github.com/hawk90/slidev-theme-one-purple-unicorn-pro)
