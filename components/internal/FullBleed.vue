<template>
  <div class="full-bleed">
    <MediaFill
      class="full-bleed-media"
      :src="image"
      :size="backgroundSize"
      :position="backgroundPosition"
      :stack="stack"
      :poster="poster"
      :role="alt ? 'img' : 'presentation'"
      :aria-label="alt || undefined"
    />
    <div v-if="overlay" class="full-bleed-overlay" :style="{ background: overlay }" />
    <div v-if="panel" class="full-bleed-panel" :style="panelStyle">
      <div class="full-bleed-panel-content">
        <slot />
      </div>
    </div>
    <div v-else class="full-bleed-content" :style="{ textAlign: align, padding: contentPadding }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MediaFill from './MediaFill.vue'

const props = defineProps({
  // Text for screen readers (empty: the picture is decoration)
  alt: { type: String, default: '' },
  // An image or a video, or a list of up to three (tiled)
  image: { type: [String, Array], default: '' },
  stack: { type: String, default: 'row' },
  poster: { type: String, default: '' },
  backgroundSize: { type: String, default: 'cover' },
  backgroundPosition: { type: String, default: 'center' },
  overlay: { type: String, default: '' },
  panel: { type: Boolean, default: false },
  panelWidth: { type: String, default: '45%' },
  panelSide: { type: String, default: 'left' },
  panelColor: { type: String, default: 'rgba(26, 27, 46, 0.92)' },
  align: { type: String, default: 'left' },
  contentPadding: { type: String, default: '3rem' },
})


const panelStyle = computed(() => ({
  width: props.panelWidth,
  background: props.panelColor,
  [props.panelSide === 'right' ? 'marginLeft' : 'marginRight']: 'auto',
}))
</script>

<style scoped>
.full-bleed {
  width: 100%;
  height: 100%;
  position: relative;
}

.full-bleed-media {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.full-bleed-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.full-bleed-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.full-bleed-content :deep(> *) {
  max-width: none;
}

.full-bleed-panel {
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
  backdrop-filter: blur(2px);
}

.full-bleed-panel-content {
  padding: 3rem;
  width: 100%;
  color: rgba(255, 255, 255, 0.8);
}

.full-bleed-panel-content :deep(h1) {
  font-size: 2rem;
  color: white;
}

/* Text follows the panel color (or a color set on its parent, e.g. a light
   panel with <ul style="color: #555">) instead of being forced white */
.full-bleed-panel-content :deep(:is(p, li)) {
  color: inherit;
}
</style>
