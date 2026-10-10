<template>
  <div class="slidev-layout quote slide-dark slide-bare">
    <CenteredSlide :padding="padding" :content-max-width="contentMaxWidth">
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
   bottom-right of it. The quote is a `>` blockquote if there is one, else a
   heading (`# "…"`), else the paragraph before the last (the attribution), or
   the only paragraph when there is no attribution. */
.quote-content {
  position: relative;
  display: inline-block;
  padding: 0 calc(var(--quote-mark-size, 5rem) * 0.55);
}

.quote-mark,
.quote-content:has(> blockquote) :deep(blockquote:last-of-type)::after,
.quote-content:not(:has(> blockquote)):has(> :is(h1, h2)) :deep(:is(h1, h2):last-of-type)::after,
.quote-content:not(:has(> :is(blockquote, h1, h2))) :deep(p:nth-last-of-type(2))::after,
.quote-content:not(:has(> :is(blockquote, h1, h2))) :deep(p:only-of-type)::after {
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

.quote-content:has(> blockquote) :deep(blockquote:last-of-type),
.quote-content:not(:has(> blockquote)):has(> :is(h1, h2)) :deep(:is(h1, h2):last-of-type),
.quote-content:not(:has(> :is(blockquote, h1, h2))) :deep(p:nth-last-of-type(2)),
.quote-content:not(:has(> :is(blockquote, h1, h2))) :deep(p:only-of-type) {
  position: relative;
}

.quote-content:has(> blockquote) :deep(blockquote:last-of-type)::after,
.quote-content:not(:has(> blockquote)):has(> :is(h1, h2)) :deep(:is(h1, h2):last-of-type)::after,
.quote-content:not(:has(> :is(blockquote, h1, h2))) :deep(p:nth-last-of-type(2))::after,
.quote-content:not(:has(> :is(blockquote, h1, h2))) :deep(p:only-of-type)::after {
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

/* The attribution: the last paragraph after a blockquote or heading quote,
   or after the quote paragraph(s); a lone paragraph is the quote itself */
.quote-content:has(> :is(blockquote, h1, h2)) :deep(p:last-of-type:not(blockquote p)),
.quote-content :deep(p:last-of-type:not(:only-of-type):not(blockquote p)) {
  font-size: 0.9rem;
  font-style: normal;
  color: var(--text-muted, #5c6370);
  margin-top: 1.5rem;
}

.quote-content :deep(blockquote) {
  /* The quote itself here, not the boxed callout of other slides */
  border: 0;
  background: none;
  padding: 0;
  margin: 0;
  border-radius: 0;
}

.quote-content :deep(strong) {
  color: var(--primary-400, #c678dd);
}
</style>
