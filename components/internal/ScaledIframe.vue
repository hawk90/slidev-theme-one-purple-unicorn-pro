<template>
  <iframe
    class="scaled-iframe"
    :src="near ? src : 'about:blank'"
    :title="title"
    :style="scaleStyle"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'

const props = defineProps({
  src: { type: String, required: true },
  scale: { type: [Number, String], default: 1 },
  title: { type: String, default: undefined },
})

// Slidev keeps every slide mounted, so an embedded page would load at startup
// and keep running hidden all talk (8-10 % of a core for sli.dev). Load it on
// this slide and its neighbours only (so it is ready on arrival); elsewhere
// about:blank stops it. Exports always load it.
const { $page: page } = useSlideContext()
const { currentPage, isPrintMode } = useNav()
const near = computed(() => isPrintMode.value || !page?.value || Math.abs(currentPage.value - page.value) <= 1)

// Render at 1/scale size, then scale back down to fill the container.
// A missing, zero or non-numeric scale falls back to 1; tiny values are
// clamped so the iframe never renders at an enormous size.
const MIN_SCALE = 0.05
const scaleStyle = computed(() => {
  const n = Number(props.scale)
  const s = Number.isFinite(n) && n > 0 ? Math.max(n, MIN_SCALE) : 1
  return {
    width: `${100 / s}%`,
    height: `${100 / s}%`,
    transform: `scale(${s})`,
    transformOrigin: '0 0',
  }
})
</script>

<style scoped>
.scaled-iframe {
  border: none;
}
</style>
