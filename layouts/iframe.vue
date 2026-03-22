<template>
  <div class="slidev-layout iframe-layout">
    <iframe
      :src="url"
      :style="iframeStyle"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  url: { type: String, required: true },
  scale: { type: [Number, String], default: 1 },
})

const iframeStyle = computed(() => {
  const s = Number(props.scale)
  return {
    width: `${100 / s}%`,
    height: `${100 / s}%`,
    transform: `scale(${s})`,
    transformOrigin: '0 0',
  }
})
</script>

<style scoped>
.iframe-layout {
  @apply w-full h-full;
  overflow: hidden;
}

.iframe-layout iframe {
  border: none;
}
</style>
