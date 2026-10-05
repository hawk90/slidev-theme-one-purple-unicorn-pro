<template>
  <div class="slidev-layout quote slide-dark slide-bare">
    <CenteredSlide dark :padding="padding" :content-max-width="contentMaxWidth">
      <div class="quote-mark">&ldquo;</div>
      <div class="quote-content">
        <slot />
      </div>
    </CenteredSlide>
  </div>
</template>

<script setup lang="ts">
import CenteredSlide from '../components/internal/CenteredSlide.vue'

defineProps({
  padding: { type: String, default: '4rem 6rem' },
  contentMaxWidth: { type: String, default: '48rem' },
})
</script>

<style scoped>
.quote-mark {
  font-size: var(--quote-mark-size, 5rem);
  line-height: 1;
  font-family: Georgia, 'Noto Serif KR', serif;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.6;
  margin-bottom: -1rem;
}

.quote-content :deep(p) {
  font-size: var(--quote-size, 1.4rem);
  line-height: 1.6;
  font-style: italic;
  color: var(--text-primary, #dce0e8);
}

.quote-content :deep(p:last-of-type) {
  font-size: 0.9rem;
  font-style: normal;
  color: var(--text-muted, #5c6370);
  margin-top: 1.5rem;
}

.quote-content :deep(strong) {
  color: var(--primary-400, #c678dd);
}
</style>
