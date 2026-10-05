<template>
  <!-- Kept for backward compatibility: dark centered slide with large heading -->
  <div class="slidev-layout full-dark slide-dark slide-bare">
    <CenteredSlide dark :padding="padding" :content-max-width="contentMaxWidth">
      <slot />
    </CenteredSlide>
  </div>
</template>

<script setup lang="ts">
import CenteredSlide from '../components/internal/CenteredSlide.vue'
import { centeredLayoutProps } from '../utils/layout-props'

defineProps(centeredLayoutProps('52rem', '3rem'))
</script>

<style scoped>
.full-dark {
  color: var(--dark-fg-bright, #dce0e8);
}

.full-dark :deep(h1) {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.15;
  margin-bottom: 1.5rem;
}

.full-dark :deep(p) {
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--text-secondary, #abb2bf);
}
</style>
