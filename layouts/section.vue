<template>
  <div class="slidev-layout section">
    <div class="section-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.section {
  @apply h-full flex items-center justify-center;
  background: var(--dark-bg);
}

.section-content {
  @apply text-center max-w-4xl mx-auto px-8;
}
</style>