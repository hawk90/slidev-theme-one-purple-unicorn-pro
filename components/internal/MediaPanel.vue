<template>
  <div class="media-panel" :class="`media-${side}`" :style="{ '--_media-width': mediaWidth(width) }">
    <div
      class="media-container"
      :role="type === 'image' ? (alt ? 'img' : 'presentation') : undefined"
      :aria-label="type === 'image' && alt ? alt : undefined"
    >
      <ScaledIframe v-if="type === 'iframe'" :src="String(src)" :scale="scale" :title="title" :poster="poster" />
      <MediaFill v-else :src="src" :size="backgroundSize" :stack="stack" :poster="poster" />
    </div>
    <div class="media-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { mediaWidth } from '../../utils/media'
import MediaFill from './MediaFill.vue'
import ScaledIframe from './ScaledIframe.vue'

defineProps({
  // An image or a video, or a list of up to three (image type)
  src: { type: [String, Array], default: '' },
  type: { type: String, default: 'image' },
  side: { type: String, default: 'left' },
  backgroundSize: { type: String, default: 'cover' },
  scale: { type: [Number, String], default: 1 },
  // Text for screen readers: alt for an image (empty = decorative), title for an iframe
  alt: { type: String, default: '' },
  title: { type: String, default: undefined },
  // The media column's width: 50% by default; "40%", 0.4, "2/5", "30rem"
  width: { type: [String, Number], default: undefined },
  // Several: side by side (row) or stacked (column)
  stack: { type: String, default: 'row' },
  // A video's poster (also its picture in exports), or an iframe's still for exports
  poster: { type: String, default: '' },
})
</script>

<style scoped>
.media-panel {
  display: grid;
  grid-template-columns: var(--_media-width, 50%) 1fr;
  width: 100%;
  height: 100%;
}

.media-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.media-right {
  grid-template-columns: 1fr var(--_media-width, 50%);
}

.media-right .media-container {
  order: 2;
}

.media-content {
  padding: 2rem;
  overflow: auto;
}
</style>
