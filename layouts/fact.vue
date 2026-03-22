<template>
  <div class="slidev-layout fact">
    <div class="fact-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.fact {
  @apply h-full flex items-center justify-center;
  padding: 4rem 6rem;
  background: var(--dark-bg);
}

.fact-content {
  @apply text-center;
  max-width: 48rem;
}

.fact-content :deep(h1) {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.fact-content :deep(p) {
  font-size: 1.1rem;
  color: var(--text-secondary, #abb2bf);
  line-height: 1.5;
}

.fact-content :deep(h2) {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-muted, #5c6370);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}
</style>
