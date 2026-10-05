<template>
  <div class="slidev-layout fact slide-dark slide-bare">
    <CenteredSlide dark :padding="padding" :content-max-width="contentMaxWidth">
      <slot />
    </CenteredSlide>
  </div>
</template>

<script setup lang="ts">
import CenteredSlide from '../components/internal/CenteredSlide.vue'
import { centeredLayoutProps } from '../utils/layout-props'

defineProps(centeredLayoutProps('48rem'))
</script>

<style scoped>
.fact :deep(h1) {
  font-size: var(--fact-size, 4rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.fact :deep(p) {
  font-size: 1.1rem;
  color: var(--text-secondary, #abb2bf);
  line-height: 1.5;
}

.fact :deep(h2) {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-muted, #5c6370);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}
</style>
