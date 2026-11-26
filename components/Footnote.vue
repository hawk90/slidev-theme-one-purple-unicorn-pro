<template>
  <div ref="el" class="footnote">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { LAYOUT_CLASS } from '../utils/slidev-dom'

// The footnote is pinned (position: fixed) and takes no room, so it tells its
// slide how far up from the bottom edge it reaches: --footnote-reserve on the
// layout root. Blocks that run to the bottom of the slide (the column layouts'
// bottom slot, .stretch) stop above it (--bottom-reserve, styles/blocks.css).
// It stays a calc() on --footnote-bottom, which a footer line or a bottom
// stage indicator raises without resizing the footnote.
const el = ref<HTMLElement>()
let layout: HTMLElement | null = null
let observer: ResizeObserver | undefined

function update(leaving = false) {
  if (!layout) return
  // The tallest footnote on the slide (offsetHeight: slide pixels, unscaled;
  // 0 while the slide is hidden, measured again when it shows)
  const height = Math.max(0, ...[...layout.querySelectorAll<HTMLElement>('.footnote')]
    .filter(f => !leaving || f !== el.value)
    .map(f => f.offsetHeight))
  if (height) layout.style.setProperty('--footnote-reserve', `calc(var(--footnote-bottom, 2rem) + ${height}px + var(--footnote-gap, 0.5rem))`)
  else layout.style.removeProperty('--footnote-reserve')
}

onMounted(() => {
  layout = el.value?.closest<HTMLElement>(`.${LAYOUT_CLASS}`) ?? null
  if (!layout || !el.value) return
  observer = new ResizeObserver(() => update())
  observer.observe(el.value)
  update()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  update(true)
})
</script>

<style scoped>
.footnote {
  position: fixed;
  bottom: var(--footnote-bottom, 2rem);
  left: var(--footnote-left, 2rem);
  right: var(--footnote-right, 6rem);
  font-size: var(--footnote-size, 0.75rem);
  line-height: 1.4;
  color: var(--text-muted);
  border-top: 1px solid var(--border-default);
  padding-top: 0.4rem;
  pointer-events: auto;
  z-index: 5;
}

.footnote :deep(a) {
  color: var(--primary-400);
  font-size: inherit;
  text-decoration: none;
  border-bottom: 1px dashed var(--primary-600);
  transition: color var(--transition-base), border-color var(--transition-base);
  pointer-events: auto;
  cursor: pointer;
}

.footnote :deep(a)::after {
  display: none;
}

.footnote :deep(a:hover) {
  color: var(--primary-300);
  border-color: var(--primary-400);
}

/* Markdown wraps footnote text in <p>; keep it at the footnote size
   instead of the theme's body paragraph size */
.footnote :deep(p) {
  font-size: inherit;
  line-height: inherit;
  margin: 0;
}

/* Reference number: same size and baseline as the text, marked by color */
.footnote :deep(sup) {
  color: var(--primary-400);
  font-size: inherit;
  font-weight: 600;
  vertical-align: baseline;
  position: static;
  top: 0;
  margin-right: 0.3rem;
}
</style>
