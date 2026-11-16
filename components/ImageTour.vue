<template>
  <!-- A walk through a screenshot (an Nsight timeline, a dashboard): one spot
       per click. `mode`: callout (a numbered pin and its note), mask (the rest
       dims) or zoom (the image zooms onto the spot). Spots are in fractions of
       the image (0–1), so they stay put at any size. Steps count in the slide's
       clicks; an export shows the last one (callouts: all pins). -->
  <figure class="image-tour" :class="`tour-${mode}`" :style="{ width }">
    <div class="tour-stage">
      <img :src="resolveAssetUrl(src)" :alt="alt" class="tour-img" :style="zoomStyle">
      <!-- mask: a frame around the spot with a huge shadow dims the rest -->
      <div v-if="mode === 'mask' && spot" class="tour-mask" :style="box(spot)" />
      <template v-if="mode === 'callout'">
        <div
          v-for="(s, i) in shownSpots"
          :key="i"
          class="tour-pin"
          :class="{ 'tour-pin-current': i === index }"
          :style="{ left: `${s.x * 100}%`, top: `${s.y * 100}%` }"
        >
          <span class="tour-num">{{ i + 1 }}</span>
          <span v-if="s.label" class="tour-note" :class="{ 'tour-note-left': s.x > 0.6 }" v-html="richText(s.label)" />
        </div>
      </template>
    </div>
    <figcaption v-if="mode !== 'callout' && spot?.label" class="tour-caption" v-html="richText(spot.label)" />
  </figure>
</template>

<script lang="ts">
let nextId = 0
</script>

<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import { resolveAssetUrl, useSlideContext } from '@slidev/client'
import { richText } from '../utils/rich-text'
import { tourZoom } from '../utils/image-tour'

interface Spot { x: number, y: number, w?: number, h?: number, label?: string }

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  /** [{ x, y, w, h, label }]: the spot's center (x, y) and size (w, h), in fractions of the image */
  spots: { type: Array as () => Spot[], required: true },
  /** callout (default) | mask | zoom */
  mode: { type: String, default: 'callout' },
  width: { type: String, default: '100%' },
})

function context() {
  try { return useSlideContext().$clicksContext }
  catch { return undefined }
}
const clicks = context()
const info = clicks?.calculateSince('+1', props.spots.length) ?? null
if (clicks && info) {
  const id = `image-tour-${nextId++}`
  clicks.register(id, info)
  onUnmounted(() => clicks.unregister(id))
}

// before the first click: no spot; then one per click (outside a slide: the last)
const index = computed(() => (clicks && info ? Math.min(props.spots.length - 1, clicks.current - info.start) : props.spots.length - 1))
const spot = computed(() => (index.value >= 0 ? props.spots[index.value] : null))
const shownSpots = computed(() => props.spots.slice(0, index.value + 1))

const box = (s: Spot) => {
  const w = s.w ?? 0.2
  const h = s.h ?? 0.2
  return { left: `${(s.x - w / 2) * 100}%`, top: `${(s.y - h / 2) * 100}%`, width: `${w * 100}%`, height: `${h * 100}%` }
}
const zoomStyle = computed(() => (props.mode === 'zoom' && spot.value ? tourZoom(spot.value) : undefined))
</script>

<style scoped>
/* Variables: --tour-color (pins, the mask's frame), --tour-dim (0.6) */
.image-tour {
  margin: 0.5rem auto;
}

.tour-stage {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.tour-img {
  display: block;
  width: 100%;
  margin: 0;
  border-radius: 0;
  transform-origin: 0 0;
  transition: transform var(--motion-slow, 1.2s) var(--motion-ease, ease);
}

.tour-mask {
  position: absolute;
  border-radius: 6px;
  outline: 2px solid var(--tour-color, var(--one-dark-yellow));
  box-shadow: 0 0 0 200vmax rgba(0, 0, 0, var(--tour-dim, 0.6));
  transition: all var(--motion-base, 0.4s) var(--motion-ease, ease);
  pointer-events: none;
}

.tour-pin {
  position: absolute;
  translate: -50% -50%;
}

.tour-num {
  display: grid;
  place-items: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background: var(--tour-color, var(--primary-400));
  color: #fff;
  font-weight: 700;
  font-size: 0.8rem;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tour-color, var(--primary-400)) 35%, transparent), 0 4px 10px rgba(0, 0, 0, 0.35);
  opacity: 0.7;
}

.tour-pin-current .tour-num { opacity: 1; scale: 1.15; }

.tour-note {
  position: absolute;
  left: calc(100% + 0.5rem);
  top: 50%;
  translate: 0 -50%;
  width: max-content;
  max-width: 16rem;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  background: rgba(20, 22, 30, 0.88);
  color: #fff;
  font-size: 0.75rem;
  line-height: 1.35;
  opacity: 0;
  transition: opacity var(--motion-base, 0.4s);
}

.tour-note-left { left: auto; right: calc(100% + 0.5rem); }
.tour-pin-current .tour-note { opacity: 1; }

.tour-caption {
  margin-top: 0.4rem;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
}
</style>
