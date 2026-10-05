<template>
  <div class="slidev-layout statement slide-dark slide-bare">
    <CenteredSlide dark :padding="padding" :content-max-width="contentMaxWidth">
      <slot />
    </CenteredSlide>
  </div>
</template>

<script setup lang="ts">
import CenteredSlide from '../components/internal/CenteredSlide.vue'

defineProps({
  padding: { type: String, default: '4rem 6rem' },
  contentMaxWidth: { type: String, default: '52rem' },
})
</script>

<style scoped>
.statement :deep(h1) {
  font-size: var(--statement-size, 2.5rem);
  line-height: 1.3;
  font-weight: 800;
}

.statement :deep(p) {
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--text-secondary, #abb2bf);
  margin-top: 1rem;
}
</style>
