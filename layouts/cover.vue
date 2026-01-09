<template>
  <div class="slidev-layout cover">
    <div class="cover-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cover {
  @apply h-full flex items-center justify-center;
  background: var(--dark-bg);
}

.cover-content {
  @apply text-center max-w-4xl mx-auto px-8;
}
</style>