<template>
  <div class="slidev-layout full-text slide-bare">
    <slot />
  </div>
</template>

<style scoped>
.full-text {
  padding: var(--full-text-padding, 2rem 3rem);
  overflow: auto;
}

.full-text :deep(> *) {
  max-width: none;
}

.full-text :deep(h1) {
  margin-bottom: 1rem;
}
</style>
