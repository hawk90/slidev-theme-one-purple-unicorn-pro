<template>
  <div class="slidev-layout full-dark">
    <div class="full-dark-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.full-dark {
  width: 100%;
  height: 100%;
  padding: 0 !important;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dark-bg, #1a1b2e);
  color: var(--dark-fg-bright, #dce0e8);
}

.full-dark-content {
  text-align: center;
  max-width: 52rem;
  padding: 3rem;
}

.full-dark-content :deep(h1) {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.15;
  margin-bottom: 1.5rem;
}

.full-dark-content :deep(p) {
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--text-secondary, #abb2bf);
}
</style>
