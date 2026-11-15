<template>
  <div class="slidev-layout quote slide-dark slide-bare">
    <CenteredSlide :padding="padding" :content-max-width="contentMaxWidth">
      <div ref="box" class="quote-content">
        <span class="quote-mark quote-open" aria-hidden="true">&ldquo;</span>
        <slot />
      </div>
    </CenteredSlide>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue'
import CenteredSlide from '../components/internal/CenteredSlide.vue'
import { centeredLayoutProps } from '../utils/layout-props'

defineProps(centeredLayoutProps('48rem'))

// The element the closing mark goes on (.quote-text): the last `>`
// blockquote, else the last heading (`# "…"`), else the paragraph before the
// last (the attribution), or the only paragraph. Picked here once per render
// instead of by a :has() chain repeated in three rules.
const box = ref<HTMLElement>()
function markQuote() {
  const el = box.value
  if (!el) return
  const kids = [...el.children].filter(k => !k.classList.contains('quote-mark'))
  const last = (sel: string) => kids.filter(k => k.matches(sel)).at(-1)
  const ps = kids.filter(k => k.tagName === 'P')
  const target = last('blockquote') ?? last('h1, h2') ?? (ps.length === 1 ? ps[0] : ps.at(-2))
  for (const k of kids) k.classList.toggle('quote-text', k === target)
}
onMounted(markQuote)
onUpdated(markQuote)
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
.quote-content :deep(.quote-text)::after {
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

.quote-content :deep(.quote-text) {
  position: relative;
}

.quote-content :deep(.quote-text)::after {
  content: '\201D';
  right: calc(var(--quote-mark-size, 5rem) * -0.55);
  bottom: -0.75em;
}

.quote-content :deep(p) {
  font-size: var(--quote-size, 1.4rem);
  line-height: 1.6;
  font-style: italic;
  color: var(--text-primary);
}

/* The attribution: the last paragraph after a blockquote or heading quote,
   or after the quote paragraph(s); a lone paragraph is the quote itself */
.quote-content:has(> :is(blockquote, h1, h2)) :deep(p:last-of-type:not(blockquote p)),
.quote-content :deep(p:last-of-type:not(:only-of-type):not(blockquote p)) {
  font-size: 0.9rem;
  font-style: normal;
  color: var(--text-muted);
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
  color: var(--primary-400);
}
</style>
