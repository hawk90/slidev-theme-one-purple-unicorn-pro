<template>
  <div class="footnote">
    <slot />
  </div>
</template>

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
