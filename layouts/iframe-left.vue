<template>
  <div class="slidev-layout iframe-left-layout">
    <div class="iframe-container">
      <iframe
        :src="url"
        :style="iframeStyle"
        frameborder="0"
        allowfullscreen
      />
    </div>
    <div class="content">
      <slot />
    </div>
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
.iframe-left-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  @apply w-full h-full;
}

.iframe-container {
  @apply w-full h-full;
  overflow: hidden;
}

.iframe-container iframe {
  border: none;
}

.content {
  @apply p-8 overflow-auto;
}
</style>
