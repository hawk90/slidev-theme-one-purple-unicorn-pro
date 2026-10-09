<template>
  <div class="media-panel" :class="`media-${side}`">
    <div
      class="media-container"
      :style="mediaStyle"
      :role="type === 'image' ? (alt ? 'img' : 'presentation') : undefined"
      :aria-label="type === 'image' && alt ? alt : undefined"
    >
      <ScaledIframe v-if="type === 'iframe'" :src="src" :scale="scale" :title="title" />
    </div>
    <div class="media-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveAssetUrl } from '@slidev/client'
import ScaledIframe from './ScaledIframe.vue'

const props = defineProps({
  src: { type: String, required: true },
  type: { type: String, default: 'image' },
  side: { type: String, default: 'left' },
  backgroundSize: { type: String, default: 'cover' },
  scale: { type: [Number, String], default: 1 },
  // Text for screen readers: alt for an image (empty = decorative), title for an iframe
  alt: { type: String, default: '' },
  title: { type: String, default: undefined },
})

const mediaStyle = computed(() => {
  if (props.type === 'image') {
    return {
      // Resolved against the deck's base path so `--base` builds work
      backgroundImage: `url(${JSON.stringify(resolveAssetUrl(props.src))})`,
      backgroundSize: props.backgroundSize,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }
  }
  return {}
})
</script>

<style scoped>
.media-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100%;
}

.media-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.media-right .media-container {
  order: 2;
}

.media-content {
  padding: 2rem;
  overflow: auto;
}
</style>
