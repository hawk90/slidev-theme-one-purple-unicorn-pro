<template>
  <!-- Progress Bar: always or content-only based on frontmatter -->
  <div v-if="showBar" class="progress-bar" :class="{ 'chrome-on-dark': onDark }">
    <div class="progress-fill" :style="{ width: progress + '%' }" />
  </div>

  <!-- Footer info line: title · author · event · date (opt-in, `footer:`) -->
  <div v-if="footer" class="slide-footer" :class="{ 'chrome-on-dark': onDark }">
    <img v-if="footer.logo" :src="resolveAssetUrl(footer.logo)" alt="" class="slide-footer-logo" />
    <span v-if="footer.text" class="slide-footer-text">{{ footer.text }}</span>
  </div>

  <!-- Page Indicator -->
  <div v-if="showPageNumber" class="slide-indicator" :class="{ 'chrome-on-dark': onDark }">
    {{ currentPage }} / {{ total }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { configs, resolveAssetUrl, useNav } from '@slidev/client'
import { DARK_LAYOUTS, NO_PAGE_NUMBER_LAYOUTS } from './utils/layouts'
import { parsePageList } from './utils/pages'
import { footerParts, isHeadmatterSlide, isOff, isOn } from './utils/talk-info'

const { currentPage, total, currentLayout, currentSlideRoute, isPrintMode } = useNav()

const isHidden = computed(() => NO_PAGE_NUMBER_LAYOUTS.includes(currentLayout.value))
const onDark = computed(() => DARK_LAYOUTS.includes(currentLayout.value))

// Deck-wide options come from the headmatter, read from `configs` (it keeps
// the headmatter even when the first slide is hidden, and Slidev's title
// fallback); a slide's own frontmatter overrides progressBar for that slide.
// `configs` carries Slidev's defaults too: a deck without a title (and no
// heading on its first slide) has title "Slidev", which is not the talk's
const headmatter: Record<string, unknown> = { ...configs, title: configs.title === 'Slidev' ? undefined : configs.title }
const frontmatter = computed(() => currentSlideRoute.value?.meta?.slide?.frontmatter ?? {})

// progressBar:
//   "always" (default) → all slides
//   "content"          → only where page number is shown (hides on cover/section/intro/end)
//   false              → completely off
const progressMode = computed(() => {
  const val = frontmatter.value.progressBar ?? headmatter.progressBar
  if (isOff(val)) return 'off'
  if (val === 'content') return 'content'
  return 'always'
})

// progressBarSkip: pages without the bar, e.g. "1, 5, 10-12" or [1, 5, "10-12"]
// progressBarSkipMode:
//   "hide" (default) → only hide the bar on those pages
//   "exclude"        → also leave them out of the progress calculation
const skipPages = computed(() => parsePageList(headmatter.progressBarSkip, total.value))
const excludeSkipped = computed(() => headmatter.progressBarSkipMode === 'exclude')

// Export / print (PDF, PNG): progressBarInExport / pageNumberInExport (headmatter)
// turn each one off in exports only; the presentation itself is unchanged.
const hiddenInExport = (key: string) => isPrintMode.value && isOff(headmatter[key])

// pageNumber: false hides the page number (headmatter for the deck, or a slide)
const showPageNumber = computed(() => {
  if (isHidden.value) return false
  if (isOff(frontmatter.value.pageNumber ?? headmatter.pageNumber)) return false
  return !hiddenInExport('pageNumberInExport')
})

const showBar = computed(() => {
  if (hiddenInExport('progressBarInExport')) return false
  if (skipPages.value.has(currentPage.value)) return false
  if (progressMode.value === 'off') return false
  if (progressMode.value === 'content') return !isHidden.value
  return true // always
})

// footer: true shows the talk's details from the headmatter (title · author ·
// event · date, and the logo: those that are set; see utils/talk-info.ts), or
// a list picks them in its order ([title, event]). A slide's own `footer`
// (false, true, a list) replaces the deck's for that slide, so a slide can
// also turn it on; `true` there keeps the deck's list. Hidden where the page
// number is (cover, intro, end, section). Not to be confused with <Footnote>.
const footer = computed(() => {
  if (isHidden.value || hiddenInExport('footerInExport')) return null
  const deck = headmatter.footer
  // The first slide's frontmatter is the headmatter: its `footer` is the deck's
  const own = isHeadmatterSlide(currentSlideRoute.value?.meta?.slide) ? undefined : frontmatter.value.footer
  const value = own === undefined ? deck : isOn(own) && Array.isArray(deck) ? deck : own
  const parts = footerParts(value, headmatter)
  return parts && (parts.text || parts.logo) ? parts : null
})

const progress = computed(() => {
  let page = currentPage.value
  let count = total.value
  if (excludeSkipped.value) {
    const skipped = [...skipPages.value]
    page -= skipped.filter(n => n < page).length
    count -= skipped.length
  }
  return count > 1 ? ((page - 1) / (count - 1)) * 100 : 0
})
</script>

<style>
/* A Footnote sits where the footer line is: move it up while the line shows
   (the footer comes before the slides in the DOM, play and print alike;
   Footnote reads --footnote-bottom) */
.slide-footer ~ * {
  --footnote-bottom: var(--footnote-bottom-with-footer, 3.25rem);
}

/* …and above a stage indicator at the bottom (stagePosition: bottom), which
   sits over the footer line */
:is(#slide-content, .print-slide-container):has(> .stage-pos-bottom) > * {
  --footnote-bottom: var(--footnote-bottom-with-stage, 4.25rem);
}
</style>

<style scoped>
/* Theme variables: --progress-height, --progress-track, --progress-color,
   --progress-glow, --page-number-size/-color/-right/-bottom */
.progress-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: var(--progress-height, 3px);
  background: var(--progress-track, var(--_progress-track-default, rgba(255, 255, 255, 0.06)));
  z-index: 100;
  pointer-events: none;
}

.progress-fill {
  height: 100%;
  background: var(--progress-color, var(--gradient-primary, linear-gradient(90deg, #61afef, #c678dd)));
  border-radius: 0 2px 2px 0;
  transition: width 300ms ease;
  box-shadow: var(--progress-glow, 0 0 8px color-mix(in srgb, var(--_root-primary-400, #c678dd) 40%, transparent));
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

/* Theme variables: --footer-size, --footer-color, --footer-left, --footer-bottom,
   --footer-logo-height */
.slide-footer {
  position: fixed;
  left: var(--footer-left, 2rem);
  bottom: var(--footer-bottom, 1.5rem);
  max-width: 70%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--footer-size, 0.75rem);
  color: var(--footer-color, var(--text-muted, #5c6370));
  letter-spacing: 0.02em;
  opacity: 0.7;
  z-index: 10;
  pointer-events: none;
}

/* A long line ends in "…" rather than running into the page number */
.slide-footer-text {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.slide-footer-logo {
  flex: none;
  height: var(--footer-logo-height, 1rem);
  width: auto;
}
</style>
