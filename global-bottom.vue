<template>
  <!-- Progress Bar: always or content-only based on frontmatter -->
  <div v-if="showBar" class="progress-bar" :class="{ 'chrome-on-dark': onDark }">
    <div class="progress-fill" :style="{ width: progress + '%' }" />
  </div>

  <!-- Page Indicator -->
  <div v-if="!isHidden" class="slide-indicator" :class="{ 'chrome-on-dark': onDark }">
    {{ currentPage }} / {{ total }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { DARK_LAYOUTS, NO_PAGE_NUMBER_LAYOUTS } from './utils/layouts'
import { parsePageList } from './utils/pages'

const { currentPage, total, currentLayout, currentSlideRoute, slides } = useNav()

const isHidden = computed(() => NO_PAGE_NUMBER_LAYOUTS.includes(currentLayout.value))
const onDark = computed(() => DARK_LAYOUTS.includes(currentLayout.value))

// Deck-wide options come from the headmatter (first slide's frontmatter);
// a slide's own frontmatter overrides progressBar for that slide.
const headmatter = computed(() => slides.value[0]?.meta?.slide?.frontmatter ?? {})
const frontmatter = computed(() => currentSlideRoute.value?.meta?.slide?.frontmatter ?? {})

// progressBar:
//   "always" (default) → all slides
//   "content"          → only where page number is shown (hides on cover/section/intro/end)
//   false              → completely off
const progressMode = computed(() => {
  const val = frontmatter.value.progressBar ?? headmatter.value.progressBar
  if (val === false || val === 'false') return 'off'
  if (val === 'content') return 'content'
  return 'always'
})

// progressBarSkip: pages without the bar, e.g. "1, 5, 10-12" or [1, 5, "10-12"]
// progressBarSkipMode:
//   "hide" (default) → only hide the bar on those pages
//   "exclude"        → also leave them out of the progress calculation
const skipPages = computed(() => parsePageList(headmatter.value.progressBarSkip))
const excludeSkipped = computed(() => headmatter.value.progressBarSkipMode === 'exclude')

const showBar = computed(() => {
  if (skipPages.value.has(currentPage.value)) return false
  if (progressMode.value === 'off') return false
  if (progressMode.value === 'content') return !isHidden.value
  return true // always
})

const progress = computed(() => {
  let page = currentPage.value
  let count = total.value
  if (excludeSkipped.value) {
    const skipped = [...skipPages.value].filter(n => n <= count)
    page -= skipped.filter(n => n < page).length
    count -= skipped.length
  }
  return count > 1 ? ((page - 1) / (count - 1)) * 100 : 0
})
</script>

<style scoped>
/* Theme variables: --progress-height, --progress-track, --progress-color,
   --progress-glow, --page-number-size/-color/-right/-bottom */
.progress-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: var(--progress-height, 3px);
  background: var(--progress-track, rgba(255, 255, 255, 0.06));
  z-index: 100;
  pointer-events: none;
}

.progress-fill {
  height: 100%;
  background: var(--progress-color, var(--gradient-primary, linear-gradient(90deg, #61afef, #c678dd)));
  border-radius: 0 2px 2px 0;
  transition: width 300ms ease;
  box-shadow: var(--progress-glow, 0 0 8px rgba(198, 120, 221, 0.4));
}

.slide-indicator {
  position: fixed;
  right: var(--page-number-right, 2rem);
  bottom: var(--page-number-bottom, 1.5rem);
  font-family: var(--font-mono);
  font-size: var(--page-number-size, 0.75rem);
  color: var(--page-number-color, var(--text-muted, #5c6370));
  letter-spacing: 0.05em;
  opacity: 0.7;
  z-index: 10;
  pointer-events: none;
  transition: opacity var(--transition-fast, 150ms ease);
}
</style>
