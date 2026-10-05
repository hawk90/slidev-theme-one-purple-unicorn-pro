<template>
  <kbd class="kbd"><slot /></kbd>
</template>

<style scoped>
.kbd {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.75em;
  line-height: 1.4;
  color: var(--text-bright, #e6e6e6);
  background: var(--key-bg, var(--bg-tertiary, #3e4452));
  border: 1px solid var(--border-default, rgba(255, 255, 255, 0.15));
  border-bottom: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 0.25rem;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);
  white-space: nowrap;
  vertical-align: middle;
}

/* Dark mode: one step lighter than the card surface so the key stands out */
html.dark .kbd,
.slide-dark .kbd {
  --key-bg: #4b5263;
}
</style>
