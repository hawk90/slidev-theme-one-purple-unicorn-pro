<template>
  <div class="slidev-layout end">
    <div class="end-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.end {
  @apply h-full flex items-center justify-center;
  background: var(--dark-bg);
}

.end-content {
  @apply text-center max-w-4xl mx-auto px-8;
}
</style>