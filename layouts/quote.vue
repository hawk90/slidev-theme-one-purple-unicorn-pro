<template>
  <div class="slidev-layout quote slide-dark slide-bare">
    <CenteredSlide dark :padding="padding" :content-max-width="contentMaxWidth">
      <div class="quote-content">
        <span class="quote-mark quote-open" aria-hidden="true">&ldquo;</span>
        <slot />
      </div>
    </CenteredSlide>
  </div>
</template>

<script setup lang="ts">
import CenteredSlide from '../components/internal/CenteredSlide.vue'
import { centeredLayoutProps } from '../utils/layout-props'

defineProps(centeredLayoutProps('48rem'))
</script>

<style scoped>
/* Opening mark at the top-left of the quote text, closing mark at the
   bottom-right of it (the last paragraph is the attribution) */
.quote-content {
  position: relative;
  display: inline-block;
  padding: 0 calc(var(--quote-mark-size, 5rem) * 0.55);
}

.quote-mark,
.quote-content :deep(p:nth-last-of-type(2))::after {
  font-size: var(--quote-mark-size, 5rem);
  line-height: 1;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-style: normal;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.6;
  position: absolute;
}

.quote-open {
  left: 0;
  top: -0.35em;
}

.quote-content :deep(p:nth-last-of-type(2)) {
  position: relative;
}

.quote-content :deep(p:nth-last-of-type(2))::after {
  content: '\201D';
  right: calc(var(--quote-mark-size, 5rem) * -0.55);
  bottom: -0.75em;
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
