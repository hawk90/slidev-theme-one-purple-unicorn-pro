<template>
  <div class="footnote">
    <slot />
  </div>
</template>

<style scoped>
.footnote {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  right: 6rem;
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--text-muted, #5c6370);
  border-top: 1px solid var(--border-default, rgba(255, 255, 255, 0.08));
  padding-top: 0.4rem;
  pointer-events: auto;
  z-index: 5;
}

.footnote :deep(a) {
  color: var(--primary-400, #c678dd);
  font-size: inherit;
  text-decoration: none;
  border-bottom: 1px dashed var(--primary-600, #a652b8);
  transition: color 0.2s ease, border-color 0.2s ease;
  pointer-events: auto;
  cursor: pointer;
}

.footnote :deep(a)::after {
  display: none;
}

.footnote :deep(a:hover) {
  color: var(--primary-300, #d8a6e8);
  border-color: var(--primary-400, #c678dd);
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
  color: var(--primary-400, #c678dd);
  font-size: inherit;
  font-weight: 600;
  vertical-align: baseline;
  position: static;
  top: 0;
  margin-right: 0.3rem;
}
</style>
