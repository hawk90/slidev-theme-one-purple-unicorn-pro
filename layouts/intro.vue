<template>
  <div class="slidev-layout intro">
    <div class="intro-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.intro {
  @apply h-full flex items-center;
  background: var(--dark-bg);
}

.intro-content {
  @apply max-w-5xl mx-auto px-12;
}
</style>