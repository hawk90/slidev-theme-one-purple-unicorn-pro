<template>
  <nav
    v-if="!isHidden && stages.length > 0"
    class="stage-progress slide-chrome"
    :class="[`stage-pos-${position}`, `stage-labels-${labelMode}`]"
    aria-label="Stages"
  >
    <button
      v-for="(stage, i) in stages"
      :key="`stage-${stage}-${i}`"
      type="button"
      class="stage-item stage-clickable"
      :class="{
        'stage-done': i < currentIndex,
        'stage-active': i === currentIndex,
        'stage-upcoming': i > currentIndex,
      }"
      :aria-current="i === currentIndex ? 'step' : undefined"
      :aria-label="labelMode === 'all' ? undefined : stage"
      @click="onStageClick($event, i)"
      @keydown.space.stop
    >
      <span class="stage-dot" />
      <span class="stage-label" :class="{ 'stage-label-pop': labelMode === 'hover' || (labelMode === 'active' && i !== currentIndex) }">{{ stage }}</span>
      <span v-if="i < stages.length - 1" class="stage-connector" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { configs, useNav } from '@slidev/client'
import { TITLE_LAYOUTS } from '../utils/layouts'
import { headmatterOf, isOff } from '../utils/frontmatter'
import { autoStageIndex, autoStages, isAutoStages, stageLabelMode, stageOf, stagesOf, stageTarget } from '../utils/stages'

const { currentLayout, currentFrontmatter, currentPage, go, slides } = useNav()

const isHidden = computed(() => TITLE_LAYOUTS.includes(currentLayout.value))

const headmatter = headmatterOf(configs)
// useNav's currentFrontmatter (Slidev 52.18)
const frontmatter = computed(() => currentFrontmatter.value || {})

// A slide's own `stages` list wins; `stages: auto` (on the slide, or in the
// headmatter for every slide without its own) builds one stage per section
// (utils/stages.ts); `stages: false` on a slide turns the deck's off there
const auto = computed(() => {
  const own = frontmatter.value.stages
  if (Array.isArray(own) || isOff(own)) return false
  return isAutoStages(own) || isAutoStages(headmatter.stages)
})
const sections = computed(() => auto.value
  ? autoStages(slides.value.map(s => ({ no: s.no, title: s.meta?.slide?.title, frontmatter: s.meta?.slide?.frontmatter ?? {} })))
  : { stages: [], starts: [] })

const stages = computed(() => auto.value ? sections.value.stages : stagesOf(frontmatter.value))

const currentIndex = computed(() => auto.value
  ? autoStageIndex(sections.value.starts, currentPage.value)
  : stageOf(frontmatter.value))

const position = computed(() =>
  (frontmatter.value.stagePosition as string) || (headmatter.stagePosition as string) || 'top'
)

// stageLabels: all | active | hover (many automatic stages: active)
const labelMode = computed(() =>
  stageLabelMode(frontmatter.value.stageLabels ?? headmatter.stageLabels, auto.value, stages.value.length))

// A mouse click leaves no focus behind, so Space / arrows keep driving the
// slides; keyboard activation (Enter / Space) keeps focus on the button.
// Space is stopped here so it activates the button instead of advancing.
function onStageClick(event: MouseEvent, index: number) {
  if (event.detail > 0) (event.currentTarget as HTMLElement).blur()
  goToStage(index)
}

function goToStage(index: number) {
  // Automatic stages: the section's first slide
  if (auto.value) {
    const start = sections.value.starts[index]
    if (start !== undefined) go(start)
    return
  }
  // stageMap (page numbers or routeAlias names) if it points at this stage,
  // else the first slide with the same stages at that currentStage
  const { no, warning } = stageTarget(index, stages.value, frontmatter.value.stageMap,
    slides.value.map(s => ({ no: s.no, frontmatter: s?.meta?.slide?.frontmatter ?? {} })))
  if (warning) console.warn(`[theme] StageProgress: ${warning}`)
  if (no !== undefined) go(no)
}
</script>

<style scoped>
/* Variables: --stage-done-color, --stage-active-color, --stage-upcoming-color,
   --stage-dot-size, --stage-font-size (top positions use smaller defaults) */
.stage-progress {
  position: fixed;
  display: flex;
  align-items: center;
  gap: 0;
  z-index: 10;
  font-family: var(--font-mono);
}

/* Position variants
   Top variants sit in the strip above the content-slide h1 (top: 15px),
   so keep them small and pinned to the edge */
.stage-pos-top {
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: row;
}

.stage-pos-top-left {
  top: 4px;
  left: 2rem;
  flex-direction: row;
}

.stage-pos-top-right {
  top: 4px;
  right: 2rem;
  flex-direction: row;
}

.stage-pos-bottom {
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: row;
}

.stage-pos-left {
  top: 50%;
  left: 1.5rem;
  transform: translateY(-50%);
  flex-direction: column;
}

.stage-pos-right {
  top: 50%;
  right: 1.5rem;
  transform: translateY(-50%);
  flex-direction: column;
}

/* Side positions get a column of their own (see the unscoped block below):
   labels wrap within it instead of running into the content */
.stage-pos-left .stage-label,
.stage-pos-right .stage-label {
  max-width: var(--stage-side-label-width, 5.5rem);
  white-space: normal;
  text-align: center;
  overflow-wrap: anywhere;
}

/* Vertical positions: items stack, connectors run vertically */
.stage-pos-left .stage-connector,
.stage-pos-right .stage-connector {
  width: 1px;
  height: 1.5rem;
  margin: 0.25rem 0;
}

.stage-pos-left .stage-item,
.stage-pos-right .stage-item {
  flex-direction: column;
  gap: 0.15rem;
}

:is(.stage-pos-top, .stage-pos-top-left, .stage-pos-top-right) .stage-label {
  font-size: var(--stage-font-size, 0.5rem);
}

:is(.stage-pos-top, .stage-pos-top-left, .stage-pos-top-right) .stage-active .stage-label {
  font-size: calc(var(--stage-font-size, 0.5rem) * 1.1);
}

:is(.stage-pos-top, .stage-pos-top-left, .stage-pos-top-right) .stage-dot {
  width: var(--stage-dot-size, 5px);
  height: var(--stage-dot-size, 5px);
}

:is(.stage-pos-top, .stage-pos-top-left, .stage-pos-top-right) .stage-active .stage-dot {
  width: calc(var(--stage-dot-size, 5px) * 1.2);
  height: calc(var(--stage-dot-size, 5px) * 1.2);
}

/* Base item */
.stage-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  position: relative;
}

.stage-clickable {
  cursor: pointer;
  pointer-events: auto;
  /* Reset button chrome */
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  text-align: inherit;
}

.stage-clickable:focus-visible {
  outline: 1px solid var(--stage-active-color, var(--primary-400));
  outline-offset: 2px;
  border-radius: 3px;
}

.stage-clickable:focus-visible .stage-label {
  opacity: 1;
}

.stage-clickable:hover .stage-dot {
  transform: scale(1.4);
}

.stage-clickable:hover .stage-label {
  opacity: 1;
}

/* Dot */
.stage-dot {
  display: block;
  width: var(--stage-dot-size, 6px);
  height: var(--stage-dot-size, 6px);
  border-radius: 50%;
  flex-shrink: 0;
  transition: all var(--transition-base);
}

.stage-label {
  font-size: var(--stage-font-size, 0.6rem);
  letter-spacing: 0.03em;
  white-space: nowrap;
  transition: all var(--transition-base);
}

/* stageLabels: active (only the current label inline) / hover (none inline):
   the others (.stage-label-pop) show beside their dot on hover or keyboard
   focus, out of the flow so the row keeps its width. Specificity is above
   the state rules below, which set the labels' opacity */
.stage-item .stage-label.stage-label-pop {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: calc(var(--stage-dot-size, 6px) / 2);
  transform: translateX(-50%);
  max-width: none;
  white-space: nowrap;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  opacity: 0;
  pointer-events: none;
  z-index: 1;
}

.stage-item:is(:hover, :focus-visible) .stage-label.stage-label-pop {
  opacity: 1;
}

/* At the bottom: above the dot; at the sides: beside it */
.stage-pos-bottom .stage-item .stage-label.stage-label-pop {
  top: auto;
  bottom: calc(100% + 0.25rem);
}

:is(.stage-pos-left, .stage-pos-right) .stage-item .stage-label.stage-label-pop {
  top: calc(var(--stage-dot-size, 6px) / 2);
  transform: translateY(-50%);
}

.stage-pos-left .stage-item .stage-label.stage-label-pop {
  left: calc(100% + 0.5rem);
}

.stage-pos-right .stage-item .stage-label.stage-label-pop {
  left: auto;
  right: calc(100% + 0.5rem);
}

.stage-connector {
  display: block;
  width: 1.5rem;
  height: 1px;
  margin: 0 0.25rem;
  transition: background var(--transition-base);
}

/* States */
.stage-done .stage-dot {
  background: var(--stage-done-color, var(--one-dark-green));
}

.stage-done .stage-label {
  color: var(--stage-done-color, var(--one-dark-green));
  opacity: 0.7;
}

.stage-done .stage-connector {
  background: var(--stage-done-color, var(--one-dark-green));
  opacity: 0.4;
}

.stage-active .stage-dot {
  background: var(--stage-active-color, var(--primary-400));
  box-shadow: var(--dot-glow) var(--stage-active-color, var(--primary-400));
  width: calc(var(--stage-dot-size, 6px) * 1.33);
  height: calc(var(--stage-dot-size, 6px) * 1.33);
}

.stage-active .stage-label {
  color: var(--stage-active-color, var(--primary-400));
  font-weight: 600;
  font-size: calc(var(--stage-font-size, 0.6rem) * 1.08);
}

.stage-active .stage-connector {
  background: var(--border-default);
}

.stage-upcoming .stage-dot {
  background: var(--stage-upcoming-color, var(--text-muted));
  opacity: 0.6;
}

.stage-upcoming .stage-label {
  color: var(--stage-upcoming-color, var(--text-muted));
  opacity: 0.6;
}

.stage-upcoming .stage-connector {
  background: var(--stage-upcoming-color, var(--text-muted));
  opacity: 0.2;
}
</style>

<style>
/* The indicator is a sibling of the footer line and of the slide (one per
   slide in an export, under .print-slide-container), so plain CSS can make
   room for it. */

/* A Footnote sits where a bottom indicator is: move it up (it reads
   --footnote-bottom; the footer line's own move is in global-bottom.vue).
   Blocks that run to the bottom of the slide stop at the same height
   (--stage-reserve, part of --bottom-reserve in styles/blocks.css). */
:is(#slide-content, .print-slide-container):has(> .stage-pos-bottom) > * {
  --footnote-bottom: var(--footnote-bottom-with-stage, 4.25rem);
  --stage-reserve: var(--footnote-bottom-with-stage, 4.25rem);
}
/* …and higher still when the indicator is lifted above the footer line */
:is(#slide-content, .print-slide-container):has(> .slide-footer):has(> .stage-pos-bottom) > * {
  --footnote-bottom: var(--footnote-bottom-with-footer-and-stage, 5.25rem);
  --stage-reserve: var(--footnote-bottom-with-footer-and-stage, 5.25rem);
}

/* bottom: above the footer line while it shows (the footer comes first) */
.slide-footer ~ .stage-pos-bottom {
  bottom: var(--stage-bottom-with-footer, 3.25rem);
}

/* left / right: the content slide's padding on that side grows by the
   indicator's column, so text and tables stay clear of it */
:is(#slide-content, .print-slide-container):has(> .stage-pos-left) .slidev-layout:not(.slide-bare) {
  padding-left: calc(var(--slide-padding-x, 30px) + var(--stage-side-space, 6.5rem));
}

:is(#slide-content, .print-slide-container):has(> .stage-pos-right) .slidev-layout:not(.slide-bare) {
  padding-right: calc(var(--slide-padding-x, 30px) + var(--stage-side-space, 6.5rem));
}
</style>
