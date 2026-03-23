<template>
  <div class="slidev-layout quote">
    <CenteredSlide dark content-max-width="48rem">
      <div class="quote-mark">"</div>
      <div class="quote-content">
        <slot />
      </div>
    </CenteredSlide>
  </div>
</template>

<script setup lang="ts">
import CenteredSlide from '../components/internal/CenteredSlide.vue'
</script>

<style scoped>
.quote-mark {
  font-size: 5rem;
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
  font-size: 1.4rem;
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
