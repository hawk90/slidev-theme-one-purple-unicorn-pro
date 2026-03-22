<template>
  <div class="slidev-layout statement">
    <div class="statement-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.statement {
  @apply h-full flex items-center justify-center;
  padding: 4rem 6rem;
  background: var(--dark-bg);
}

.statement-content {
  @apply text-center;
  max-width: 52rem;
}

.statement-content :deep(h1) {
  font-size: 2.5rem;
  line-height: 1.3;
  font-weight: 800;
}

.statement-content :deep(p) {
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--text-secondary, #abb2bf);
  margin-top: 1rem;
}
</style>
