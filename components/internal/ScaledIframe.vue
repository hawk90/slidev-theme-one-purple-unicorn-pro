<template>
  <div class="scaled-iframe-box">
    <img v-if="isPrintMode && poster" :src="resolveAssetUrl(poster)" :alt="title || src" class="scaled-iframe-poster">
    <iframe
      v-else
      class="scaled-iframe"
      :src="near ? src : 'about:blank'"
      :title="title"
      :style="scaleStyle"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
    <!-- exports: the page's address, a link in the PDF -->
    <a v-if="isPrintMode" class="scaled-iframe-url" :href="src" target="_blank" rel="noopener">↗ {{ src }}</a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveAssetUrl, useNav, useSlideContext } from '@slidev/client'

const props = defineProps({
  src: { type: String, required: true },
  scale: { type: [Number, String], default: 1 },
  title: { type: String, default: undefined },
  /** A still for exports, in place of the live page */
  poster: { type: String, default: '' },
})

// Slidev keeps every slide mounted, so an embedded page would load at startup
// and keep running hidden all talk (8-10 % of a core for sli.dev). Load it on
// this slide and its neighbours only (so it is ready on arrival); elsewhere
// about:blank stops it. Exports always load it (unless a poster stands in).
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
.scaled-iframe-box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.scaled-iframe {
  display: block;
  border: none;
}

.scaled-iframe-poster {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: 0;
  object-fit: cover;
  object-position: top;
}

.scaled-iframe-url {
  position: absolute;
  left: 0.5rem;
  bottom: 0.5rem;
  max-width: calc(100% - 1rem);
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: rgba(20, 22, 30, 0.85);
  color: #fff;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
