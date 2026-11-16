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
  <div v-if="showBar && !ide" class="progress-bar slide-chrome">
    <div class="progress-fill" :style="{ width: progress + '%' }" />
    <div
      v-if="paceMark"
      class="progress-pace"
      :class="`pace-${paceMark.state}`"
      :style="{ left: paceMark.percent + '%' }"
    />
  </div>

  <!-- Footer info line: title · author · event · date (opt-in, `footer:`) -->
  <div v-if="footer && !ide" class="slide-footer slide-chrome">
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

  <!-- fit: where this layer sits, to find its slide (utils/autofit.ts) -->
  <span v-if="fitOn" class="fit-marker" :data-page="currentPage" :data-reserve="fitReserve" hidden />

  <!-- wip: a draft watermark (exports too) -->
  <div v-if="wip" class="slide-wip slide-chrome" aria-hidden="true"><span>{{ wip }}</span></div>

  <!-- shift+l / the nav button: the layout guide (never in exports) -->
  <div v-if="layoutGuide && !isPrintMode" class="layout-guide slide-chrome" aria-hidden="true">
    <div class="layout-guide-safe" />
    <div class="layout-guide-cols"><span v-for="i in 12" :key="i" /></div>
    <div class="layout-guide-center-x" />
    <div class="layout-guide-center-y" />
  </div>

  <!-- ide: true: file tabs and a status bar (it shows the page) -->
  <IdeChrome v-if="ide" :options="ide" />

  <!-- Page Indicator -->
  <div v-if="showPageNumber && !ide" class="slide-indicator slide-chrome">
    {{ pageText }}
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
import { watchCodeMorph } from './utils/code-morph'
import { playgroundLangs, watchPlaygrounds } from './utils/playground'
import { watchLightbox } from './utils/lightbox'
import { glossaryEntries, watchGlossary } from './utils/glossary'
import { watchPrintLinks } from './utils/print-links'
import { layoutGuide, watchMissingAssets, wipLabel } from './utils/authoring'
import { fitSlide, slideOverflows, hasAutofitAddon } from './utils/autofit'
import { headmatterOf, isHeadmatterSlide, isOff, isOn } from './utils/frontmatter'
import { progressMode as modeOf, progressPercent } from './utils/progress'
import { footerParts, footerSetting } from './utils/talk-info'
import { ideOptions } from './utils/ide'
import IdeChrome from './components/internal/IdeChrome.vue'

const nav = useNav()
const { currentPage, total, currentLayout, currentSlideRoute, currentFrontmatter, isPrintMode, isPresenter, slides } = nav

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
let stopMorph = () => {}
let stopPlayground = () => {}
let stopLightbox = () => {}
let stopGlossary = () => {}
// exports: links print as "text (url)" (utils/print-links.ts)
let stopPrintLinks = () => {}
// pictures that fail to load name their path (utils/authoring.ts)
let missing = { stop: () => {}, sweep: () => {} }
// paceBar: true (headmatter) ticks the clock the pace marker reads
const now = ref(Date.now())
let paceTimer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  stopDarkChrome = watchDarkChrome(currentPage)
  if (!isPrintMode.value) stopArrival = watchSlideArrival()
  if (!isPrintMode.value) stopStagger = watchStaggerClicks(currentPage, nav.clicks)
  // Code windows morph between slides that use transition: view-transition
  // (utils/code-morph.ts)
  const usesViewTransition = configs.transition === 'view-transition'
    || slides.value.some(r => (r.meta?.transition ?? r.meta?.slide?.frontmatter?.transition) === 'view-transition')
  if (!isPrintMode.value && usesViewTransition) stopMorph = watchCodeMorph(Number(configs.magicMoveDuration) || 800)
  // playground (headmatter, or a slide's own): Compiler Explorer buttons on
  // code blocks (utils/playground.ts)
  const ownPlayground = (no: number) => no === 1 ? undefined : slides.value[no - 1]?.meta?.slide?.frontmatter?.playground
  if (!isPrintMode.value && !isPresenter.value && (headmatter.playground !== undefined || slides.value.some((_, i) => ownPlayground(i + 1) !== undefined)))
    stopPlayground = watchPlaygrounds(no => playgroundLangs(ownPlayground(no) ?? headmatter.playground))
  // lightbox: true opens any image full screen; `.lightbox` images and
  // `.preview` links always do (utils/lightbox.ts)
  if (!isPrintMode.value) stopLightbox = watchLightbox(isOn(headmatter.lightbox))
  if (isPrintMode.value && !isOff(headmatter.printUrls)) stopPrintLinks = watchPrintLinks()
  missing = watchMissingAssets()
  // glossary (headmatter, a slide's on top): tooltips on the terms' first use
  const slideGlossary = (no: number) => (no === 1 ? undefined : slides.value[no - 1]?.meta?.slide?.frontmatter?.glossary)
  if (!isPrintMode.value && (headmatter.glossary || slides.value.some((_, i) => slideGlossary(i + 1))))
    stopGlossary = watchGlossary(no => glossaryEntries(headmatter.glossary, slideGlossary(no)))
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
onBeforeUnmount(() => { stopDarkChrome(); stopArrival(); stopStagger(); stopMorph(); stopPlayground(); stopLightbox(); stopGlossary(); stopPrintLinks(); missing.stop(); clearInterval(paceTimer); stopAdvance() })

// Deck-wide options come from the headmatter (with Slidev's title fallback);
// a slide's own frontmatter overrides progressBar for that slide
const headmatter = headmatterOf(configs)
// The current slide's own frontmatter (useNav's currentFrontmatter, Slidev 52.18)
const frontmatter = computed(() => currentFrontmatter.value ?? {})

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

// fit: true (a slide, or the headmatter; a slide's false wins) shrinks the
// slide's content to fit, once it is shown and its fonts are in; in an
// export, print-export.ts fits the pages with a .fit-marker (utils/autofit.ts). Not with the slide's own zoom:,
// nor with slidev-addon-autofit in the deck.
// ide: true (or { repo, branch, language }) in the headmatter: the IDE chrome
// replaces the progress bar, footer and page number; a slide's `ide: false`
// leaves it off there, and `ide: true` on a slide shows it on that slide alone
const ide = computed(() => {
  const own = isHeadmatterSlide(currentSlideRoute.value?.meta?.slide) ? undefined : frontmatter.value.ide
  if (own !== undefined && isOff(own)) return null
  // a slide's own `ide: true` (or options) turns it on there alone
  const value = own === undefined ? headmatter.ide : isOn(own) && headmatter.ide ? headmatter.ide : own
  return ideOptions(value, String(headmatter.title ?? ''))
})

// the footer line's room at the bottom (it overlaps the layout's padding)
const fitReserve = computed(() => ide.value ? 22 : footer.value ? 28 : 0)
const fitOn = computed(() => {
  const own = isHeadmatterSlide(currentSlideRoute.value?.meta?.slide) ? undefined : frontmatter.value.fit
  if (frontmatter.value.zoom !== undefined || hasAutofitAddon(headmatter.addons)) return false
  return isOn(own ?? headmatter.fit)
})
async function runFit() {
  // exports: print-export.ts fits the marked pages before it redraws
  if (!fitOn.value || isPrintMode.value) return
  await nextTick()
  await document.fonts?.ready
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
  const page = currentPage.value
  const find = () => document.querySelector<HTMLElement>(`#slideshow > [data-slidev-no="${page}"] .slidev-layout`)
  // a slide compiled on its first visit shows "Loading slide…" first: wait
  // for it (up to 6 s), then fit, and again as its images come in
  for (let i = 0; i < 30 && (!find() || find()!.closest('[data-slidev-no]')?.querySelector('.slidev-slide-loading')); i++)
    await new Promise(r => setTimeout(r, 200))
  const root = find()
  if (!root || page !== currentPage.value) return
  fitSlide(root, `slide ${page}`, fitReserve.value)
  for (const img of root.querySelectorAll('img')) {
    if (!img.complete) img.addEventListener('load', () => fitSlide(root, `slide ${page}`, fitReserve.value), { once: true })
  }
}
watch([currentPage, fitOn], runFit)
onMounted(runFit)

// dev: a slide whose content runs past its bottom gets a red outline and one
// warning (slides with `fit` shrink instead; utils/authoring.ts)
const warned = new Set<number>()
async function checkOverflow() {
  if (!import.meta.env.DEV || isPrintMode.value || fitOn.value) return
  const page = currentPage.value
  await new Promise(r => setTimeout(r, 900)) // past the transition and the fonts
  const root = document.querySelector<HTMLElement>(`#slideshow > [data-slidev-no="${page}"] .slidev-layout:not(.slide-bare)`)
  if (!root || page !== currentPage.value || root.closest('[data-slidev-no]')?.querySelector('.slidev-slide-loading')) return
  const over = slideOverflows(root)
  root.toggleAttribute('data-overflow-warning', over)
  if (over && !warned.has(page)) {
    warned.add(page)
    console.warn(`[theme] slide ${page} overflows its bottom: split it, or \`fit: true\``)
  }
}
watch(currentPage, () => { checkOverflow(); setTimeout(() => missing.sweep(), 600) })
onMounted(checkOverflow)

// wip: true (or a label) on a slide, or in the headmatter for every slide
const wip = computed(() => wipLabel(
  isHeadmatterSlide(currentSlideRoute.value?.meta?.slide) ? undefined : frontmatter.value.wip, headmatter.wip))

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
/* Authoring aids (utils/authoring.ts). Dev: content past the slide's bottom */
[data-overflow-warning] {
  outline: 2px dashed var(--one-dark-red);
  outline-offset: -4px;
}

/* A picture that didn't load: its path, where it would be */
img.asset-missing { display: none; }
.asset-missing-note {
  display: inline-block;
  padding: 0.5rem 0.75rem;
  border: 2px dashed var(--one-dark-red);
  border-radius: 6px;
  color: var(--one-dark-red);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

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
/* wip: a draft watermark. Variables: --wip-color */
.slide-wip {
  position: absolute;
  inset: 0;
  z-index: 150;
  display: grid;
  place-items: center;
  overflow: hidden;
  pointer-events: none;
}
.slide-wip span {
  rotate: -24deg;
  padding: 0.1em 0.6em;
  border: 6px solid currentColor;
  border-radius: 12px;
  color: color-mix(in srgb, var(--wip-color, var(--one-dark-red)) 22%, transparent);
  font-size: 7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* the layout guide: the content's safe area (the layouts' padding), 12
   columns and the center lines */
.layout-guide {
  position: absolute;
  inset: 0;
  z-index: 400;
  pointer-events: none;
  --_guide: rgba(0, 200, 255, 0.55);
}
.layout-guide-safe {
  position: absolute;
  inset: 70px var(--slide-padding-x, 30px) 20px;
  border: 1px dashed var(--_guide);
}
.layout-guide-cols {
  position: absolute;
  inset: 70px var(--slide-padding-x, 30px) 20px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}
.layout-guide-cols span { background: rgba(0, 200, 255, 0.07); }
.layout-guide-center-x,
.layout-guide-center-y {
  position: absolute;
  background: var(--_guide);
}
.layout-guide-center-x { left: 50%; top: 0; bottom: 0; width: 1px; }
.layout-guide-center-y { top: 50%; left: 0; right: 0; height: 1px; }

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
