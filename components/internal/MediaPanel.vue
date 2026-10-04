<template>
  <div class="media-panel" :class="`media-${side}`">
    <div class="media-container" :style="mediaStyle">
      <ScaledIframe v-if="type === 'iframe'" :src="src" :scale="scale" />
    </div>
    <div class="media-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ScaledIframe from './ScaledIframe.vue'

const props = defineProps({
  src: { type: String, required: true },
  type: { type: String, default: 'image' },
  side: { type: String, default: 'left' },
  backgroundSize: { type: String, default: 'cover' },
  scale: { type: [Number, String], default: 1 },
})

const mediaStyle = computed(() => {
  if (props.type === 'image') {
    return {
      backgroundImage: `url(${props.src})`,
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
