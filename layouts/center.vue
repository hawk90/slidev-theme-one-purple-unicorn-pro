<template>
  <div class="slidev-layout center">
    <div class="center-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.center {
  @apply h-full flex flex-col items-center justify-center;
  padding: 4rem;
}

.center-content {
  @apply text-center;
}
</style>
