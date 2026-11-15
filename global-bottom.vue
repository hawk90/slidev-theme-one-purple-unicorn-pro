<template>
  <!-- parallax: one wide image behind every slide, shifting a little per
       page; the slides turn translucent over it (styles below) -->
  <div
    v-if="parallax"
    class="deck-parallax"
    :style="parallax"
    aria-hidden="true"
  />

  <!-- Progress Bar: always or content-only based on frontmatter -->
  <div v-if="showBar" class="progress-bar slide-chrome">
    <div class="progress-fill" :style="{ width: progress + '%' }" />
    <div
      v-if="paceMark"
      class="progress-pace"
      :class="`pace-${paceMark.state}`"
      :style="{ left: paceMark.percent + '%' }"
    />
  </div>

  <!-- Footer info line: title · author · event · date (opt-in, `footer:`) -->
  <div v-if="footer" class="slide-footer slide-chrome">
    <img v-if="footer.logo" :src="resolveAssetUrl(footer.logo)" alt="" class="slide-footer-logo" />
    <span v-if="footer.text" class="slide-footer-text">{{ footer.text }}</span>
  </div>

  <!-- aside: a deep-dive slide's rail and corner tag -->
  <template v-if="asideLabel">
    <div class="slide-aside-rail slide-chrome" />
    <div class="slide-aside-tag slide-chrome">{{ asideLabel }}</div>
  </template>

  <!-- confidential: a red band across a top corner (shown in exports too) -->
  <div
    v-if="ribbon"
    class="slide-ribbon slide-chrome"
    :class="`ribbon-${ribbon.position}`"
    :style="{ '--_ribbon-label-scale': ribbon.labelScale, '--_ribbon-company-scale': ribbon.companyScale }"
  >
    <div class="slide-ribbon-band">
      <span class="slide-ribbon-label">{{ ribbon.label }}</span>
      <span v-if="ribbon.company" class="slide-ribbon-company">{{ ribbon.company }}</span>
    </div>
  </div>

  <!-- Page Indicator -->
  <div v-if="showPageNumber" class="slide-indicator slide-chrome">
    {{ pageText }}
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { configs, resolveAssetUrl, sharedState, useNav } from '@slidev/client'
import { durationSeconds, pace, timerElapsed } from './utils/pace'
import { ribbonOf } from './utils/ribbon'
import { advanceDelay, startAutoAdvance } from './utils/auto-advance'
import { opacityOf, parallaxProgress } from './utils/background'
import { MEDIA_LAYOUTS, NO_PAGE_NUMBER_LAYOUTS } from './utils/layouts'
import { formatPageNumber, pageLabels, parsePageList } from './utils/pages'
import { watchDarkChrome } from './utils/dark-chrome'
import { watchSlideArrival } from './utils/slide-arrival'
import { watchStaggerClicks } from './utils/stagger'
import { headmatterOf, isHeadmatterSlide, isOff, isOn } from './utils/frontmatter'
import { progressMode as modeOf, progressPercent } from './utils/progress'
import { footerParts, footerSetting } from './utils/talk-info'

const nav = useNav()
const { currentPage, total, currentLayout, currentSlideRoute, isPrintMode, isPresenter, slides } = nav

const isHidden = computed(() => NO_PAGE_NUMBER_LAYOUTS.includes(currentLayout.value))

// Chrome over a dark layout takes the dark palette (utils/dark-chrome.ts):
// in play mode and in `slidev export`'s per-slide pages (?print, the same
// #slide-content); the export page's containers are matched in CSS instead,
// and there it finds no #slide-content and does nothing
let stopDarkChrome = () => {}
// Entrances wait for the slide transition (utils/slide-arrival.ts); exports
// play none
let stopArrival = () => {}
// .stagger stops at the slide's first click (utils/stagger.ts)
let stopStagger = () => {}
// paceBar: true (headmatter) ticks the clock the pace marker reads
const now = ref(Date.now())
let paceTimer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  stopDarkChrome = watchDarkChrome(currentPage)
  if (!isPrintMode.value) stopArrival = watchSlideArrival()
  if (!isPrintMode.value) stopStagger = watchStaggerClicks(currentPage, nav.clicks)
  if (!isPrintMode.value && isOn(headmatter.paceBar)) paceTimer = setInterval(() => { now.value = Date.now() }, 1000)
  // autoAdvance (headmatter, a slide's own overrides): the play view steps
  // itself; autoAdvanceLoop: true starts over; input pauses it for
  // autoAdvanceIdle (30s). Not in exports or the presenter view.
  const deckDelay = headmatter.autoAdvance
  const anyAdvance = deckDelay !== undefined || slides.value.some(s => s.meta?.slide?.frontmatter?.autoAdvance !== undefined)
  if (!isPrintMode.value && !isPresenter.value && anyAdvance) {
    stopAdvance = startAutoAdvance(nav, () => advanceDelay(frontmatter.value.autoAdvance, deckDelay),
      isOn(headmatter.autoAdvanceLoop), (durationSeconds(headmatter.autoAdvanceIdle) ?? 30) * 1000)
  }
})
let stopAdvance = () => {}
onBeforeUnmount(() => { stopDarkChrome(); stopArrival(); stopStagger(); clearInterval(paceTimer); stopAdvance() })

// Deck-wide options come from the headmatter (with Slidev's title fallback);
// a slide's own frontmatter overrides progressBar for that slide
const headmatter = headmatterOf(configs)
const frontmatter = computed(() => currentSlideRoute.value?.meta?.slide?.frontmatter ?? {})

// progressBar: always (default) | content | false (utils/progress.ts)
const progressMode = computed(() => modeOf(frontmatter.value.progressBar ?? headmatter.progressBar))

// progressBarSkip: pages without the bar, e.g. "1, 5, 10-12" or [1, 5, "10-12"]
// progressBarSkipMode:
//   "hide" (default) → only hide the bar on those pages
//   "exclude"        → also leave them out of the progress calculation
const skipPages = computed(() => parsePageList(headmatter.progressBarSkip, total.value))
const excludeSkipped = computed(() => headmatter.progressBarSkipMode === 'exclude')

// Export / print (PDF, PNG): progressBarInExport / pageNumberInExport (headmatter)
// turn each one off in exports only; the presentation itself is unchanged.
const hiddenInExport = (key: string) => isPrintMode.value && isOff(headmatter[key])

// What each page shows (utils/pages.ts): a slide's `pageNumber: skip` / `hold`
// and `appendix: true` change the count; `pageNumberFormat` (headmatter) is
// c/t (default) | c | c of t
const pages = computed(() => pageLabels(slides.value.map(s => s?.meta?.slide?.frontmatter ?? {})))
const pageText = computed(() => {
  const page = pages.value.labels[currentPage.value - 1]
  return page ? formatPageNumber(page, pages.value.total, headmatter.pageNumberFormat) : `${currentPage.value} / ${total.value}`
})

// pageNumber: false hides the page number (headmatter for the deck, or a slide)
const showPageNumber = computed(() => {
  if (isHidden.value || !pageText.value) return false
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
// number is (cover, intro, end, section), and by default on media layouts
// (image, iframe, full-image, full-split), whose picture or page reaches the
// bottom edge: there only the slide's own `footer` shows it. Not to be
// confused with <Footnote>.
const footer = computed(() => {
  if (isHidden.value || hiddenInExport('footerInExport')) return null
  const deck = headmatter.footer
  // The first slide's frontmatter is the headmatter: its `footer` is the deck's
  const own = isHeadmatterSlide(currentSlideRoute.value?.meta?.slide) ? undefined : frontmatter.value.footer
  const value = footerSetting(own, deck, MEDIA_LAYOUTS.includes(currentLayout.value))
  const parts = footerParts(value, headmatter)
  return parts && (parts.text || parts.logo) ? parts : null
})

const progress = computed(() => progressPercent(currentPage.value, total.value, skipPages.value, excludeSkipped.value))

// aside: true | "label" marks a deep-dive slide: an accent rail on the left
// edge and a corner tag ("Deep dive", or the label). Its own frontmatter only;
// not on title slides and section dividers.
const asideLabel = computed(() => {
  const v = frontmatter.value.aside
  if (isHidden.value || v === undefined || v === null || isOff(v) || v === '') return ''
  return isOn(v) ? 'Deep dive' : String(v)
})

// parallax: /wide.jpg (headmatter): the image sits behind the slides, its
// position following the page through the slides that show it (the whole
// deck, or a run of slides with their own), so it drifts on each step.
// parallaxTint (0.72) is how much of each slide's own background stays over
// it, which keeps text readable; a slide's own `parallax: false` keeps its
// opaque background, and its own image shows on that slide only.
// The image each slide shows (null for none): a slide's own, else the deck's
const parallaxSrcs = computed(() => slides.value.map((r) => {
  const slide = r.meta?.slide
  const own = isHeadmatterSlide(slide) ? undefined : slide?.frontmatter?.parallax
  if (isOff(own)) return null
  const src = typeof own === 'string' && own.trim() ? own : headmatter.parallax
  return typeof src === 'string' && src.trim() ? src.trim() : null
}))
const parallax = computed(() => {
  const index = currentPage.value - 1
  const src = parallaxSrcs.value[index]
  if (!src) return null
  const tint = opacityOf(headmatter.parallaxTint) ?? 0.72
  return {
    'backgroundImage': `url("${resolveAssetUrl(src)}")`,
    '--_parallax-p': parallaxProgress(parallaxSrcs.value, index),
    '--parallax-tint': `${Math.round(tint * 100)}%`,
  }
})

// confidential (headmatter): the corner ribbon, utils/ribbon.ts
const ribbon = computed(() => ribbonOf(headmatter.confidential, headmatter.confidentialOn,
  frontmatter.value.confidential, currentLayout.value, isHeadmatterSlide(currentSlideRoute.value?.meta?.slide)))

// paceBar: true → a marker on the bar for the time used of the deck's
// `duration` (Slidev's, 30min by default), once the presenter view's timer
// runs; green on pace, yellow behind, red late (utils/pace.ts). Not in exports.
const paceDuration = durationSeconds(configs.duration)
const paceMark = computed(() => {
  if (isPrintMode.value || !isOn(headmatter.paceBar) || !paceDuration) return null
  const elapsed = timerElapsed(sharedState.timer, now.value)
  if (!elapsed) return null
  return pace(elapsed, paceDuration, progress.value)
})
</script>

<style>
/* A Footnote sits where the footer line is: move it up while the line shows
   (the footer comes before the slides in the DOM, play and print alike;
   Footnote reads --footnote-bottom) */
.slide-footer ~ * {
  --footnote-bottom: var(--footnote-bottom-with-footer, 3.25rem);
  /* room the column layouts' bottom slot leaves above the line */
  --footer-clearance: var(--footer-clearance-with-footer, 1.5rem);
}
/* (A Footnote also moves up for a bottom stage indicator: StageProgress.vue) */

/* parallax: the deck image, behind the slides (it comes first in the DOM).
   Each slide's background turns translucent in its own color, so dark layouts
   tint it dark and light slides light (a slide with `parallax: false` has no
   image under it, so it keeps its own). Theme variables: --parallax-tint (the
   headmatter's parallaxTint), --parallax-shift (20%: how far it travels over
   the deck), --parallax-duration */
.deck-parallax {
  position: absolute;
  top: 0;
  bottom: 0;
  /* wider than the slide by --parallax-shift, and moved left by that much
     over the deck: any image drifts, whatever its shape */
  width: calc(100% + var(--parallax-shift, 20%));
  left: calc(var(--_parallax-p, 0) * var(--parallax-shift, 20%) * -1);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  transition: left var(--parallax-duration, 0.8s) var(--motion-ease, ease);
  pointer-events: none;
}

:is(#slide-content, .print-slide-container):has(> .deck-parallax) {
  --_parallax-tint: var(--parallax-tint);
}

:is(#slide-content, .print-slide-container):has(> .deck-parallax) .slidev-layout {
  background: color-mix(in srgb, var(--slide-bg, var(--dark-bg)) var(--_parallax-tint, 72%), transparent);
}

/* aside: the tag gives the top-left corner to a stage indicator there */
:is(#slide-content, .print-slide-container):has(> .stage-pos-top-left) > .slide-aside-tag {
  left: auto;
  right: 2rem;
}

/* The confidential ribbon keeps its corner: a stage indicator or the aside
   tag there moves along the top edge, clear of it */
:is(#slide-content, .print-slide-container):has(> .ribbon-top-right) > .stage-pos-top-right {
  right: calc(var(--ribbon-size, 9rem) + 0.5rem);
}
:is(#slide-content, .print-slide-container):has(> .ribbon-top-left) > .stage-pos-top-left {
  left: calc(var(--ribbon-size, 9rem) + 0.5rem);
}
:is(#slide-content, .print-slide-container):has(> .ribbon-top-left) > .slide-aside-tag {
  left: calc(var(--ribbon-size, 9rem) + 0.5rem);
}
:is(#slide-content, .print-slide-container):has(> .ribbon-top-left):has(> .stage-pos-top-left) > .slide-aside-tag {
  left: auto;
  right: 2rem;
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
  background: var(--progress-color, var(--gradient-primary));
  border-radius: 0 2px 2px 0;
  transition: width var(--transition-slow);
  box-shadow: var(--progress-glow, 0 0 8px color-mix(in srgb, var(--_root-primary-400, #c678dd) 40%, transparent));
}

/* The pace marker: a short upright tick on the bar where the time is.
   Theme variables: --pace-on-color, --pace-behind-color, --pace-late-color */
.progress-pace {
  position: absolute;
  bottom: 0;
  width: 3px;
  height: calc(var(--progress-height, 3px) + 6px);
  margin-left: -1.5px;
  border-radius: 2px 2px 0 0;
  background: var(--_pace-color);
  box-shadow: 0 0 6px var(--_pace-color);
  transition: left 1s linear, background var(--transition-base);
}

.pace-on { --_pace-color: var(--pace-on-color, var(--one-dark-green)); }
.pace-behind { --_pace-color: var(--pace-behind-color, var(--one-dark-yellow)); }
.pace-late { --_pace-color: var(--pace-late-color, var(--one-dark-red)); }

/* confidential ribbon. Theme variables: --ribbon-color, --ribbon-text-color,
   --ribbon-size (the corner square), --ribbon-font-size */
.slide-ribbon {
  position: fixed;
  top: 0;
  width: var(--ribbon-size, 9rem);
  height: var(--ribbon-size, 9rem);
  overflow: hidden;
  z-index: 20;
  pointer-events: none;
}

.ribbon-top-right { right: 0; }
.ribbon-top-left { left: 0; }

/* The band's center line crosses the corner's diagonal 0.38 of the square in
   from each edge: about 10rem of band shows, enough for 13 label characters */
.slide-ribbon-band {
  position: absolute;
  top: calc(var(--ribbon-size, 9rem) * 0.38);
  width: calc(var(--ribbon-size, 9rem) * 1.6);
  padding: 0.2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.15;
  background: var(--ribbon-color, var(--one-dark-red));
  color: var(--ribbon-text-color, var(--on-red));
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  white-space: nowrap;
}

.ribbon-top-right .slide-ribbon-band {
  right: calc(var(--ribbon-size, 9rem) * 0.38);
  transform: translate(50%, -50%) rotate(45deg);
}

.ribbon-top-left .slide-ribbon-band {
  left: calc(var(--ribbon-size, 9rem) * 0.38);
  transform: translate(-50%, -50%) rotate(-45deg);
}

.slide-ribbon-label,
.slide-ribbon-company {
  max-width: calc(var(--ribbon-size, 9rem) * 0.95);
  overflow: hidden;
  text-overflow: ellipsis;
}

.slide-ribbon-label {
  font-size: calc(var(--ribbon-font-size, 0.8rem) * var(--_ribbon-label-scale, 1));
  font-weight: 800;
  letter-spacing: 0.12em;
}

.slide-ribbon-company {
  font-size: calc(var(--ribbon-font-size, 0.8rem) * 0.7 * var(--_ribbon-company-scale, 1));
  font-weight: 600;
  letter-spacing: 0.04em;
  opacity: 0.9;
}

/* aside. Theme variables: --aside-color, --aside-rail-width */
.slide-aside-rail {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--aside-rail-width, 4px);
  background: var(--aside-color, linear-gradient(180deg, var(--primary-400), var(--primary-600, var(--primary-500))));
  z-index: 10;
  pointer-events: none;
}

.slide-aside-tag {
  position: fixed;
  top: 0;
  left: calc(var(--aside-rail-width, 4px) + 0.5rem);
  padding: 0.05rem 0.45rem;
  border-radius: 0 0 4px 4px;
  font-family: var(--font-mono);
  font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary-400);
  background: color-mix(in srgb, var(--primary-400) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--primary-400) 35%, transparent);
  border-top: 0;
  z-index: 10;
  pointer-events: none;
}

.slide-indicator {
  position: fixed;
  right: var(--page-number-right, 2rem);
  bottom: var(--page-number-bottom, 1.5rem);
  font-family: var(--font-mono);
  font-size: var(--page-number-size, 0.75rem);
  color: var(--page-number-color, var(--text-muted));
  letter-spacing: 0.05em;
  opacity: 0.7;
  z-index: 10;
  pointer-events: none;
  transition: opacity var(--transition-fast);
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
  color: var(--footer-color, var(--text-muted));
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
