<template>
  <!-- Draws the lines of the SVG inside it, as if by hand, once the slide has
       arrived (again on each visit); exports and reduced motion show them drawn -->
  <div ref="root" class="draw-on" :class="{ 'draw-on-ready': ready, 'draw-on-play': playing }" :style="{ '--_draw': `${duration}ms` }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { durationMs } from '../utils/number'
import { onSlideArrival } from '../utils/slide-motion'

const props = defineProps({
  /** How long the drawing takes ("1.5s", "800ms") */
  duration: { type: String, default: '1.5s' },
})

const duration = durationMs(props.duration, 1500)
const root = ref<HTMLElement>()
const ready = ref(false)
const playing = ref(false)

// each stroke's length, so the dash covers it exactly
onMounted(() => {
  for (const el of root.value?.querySelectorAll<SVGGeometryElement>('path, line, polyline, polygon, circle, ellipse, rect') ?? []) {
    try { el.style.setProperty('--_len', String(Math.ceil(el.getTotalLength()))) }
    catch {}
  }
})

onSlideArrival(root, () => { playing.value = false; ready.value = true }, () => {
  requestAnimationFrame(() => { playing.value = true })
})
</script>

<style scoped>
.draw-on-ready :deep(:is(path, line, polyline, polygon, circle, ellipse, rect)) {
  stroke-dasharray: var(--_len, 1000);
  stroke-dashoffset: var(--_len, 1000);
}

.draw-on-play :deep(:is(path, line, polyline, polygon, circle, ellipse, rect)) {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset var(--_draw) var(--motion-ease, ease);
}
</style>
