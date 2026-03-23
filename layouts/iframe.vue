<template>
  <div class="slidev-layout iframe-layout" :class="`iframe-${side}`">
    <div v-if="side === 'left' || side === 'full'" class="iframe-container">
      <iframe :src="url" :style="iframeStyle" frameborder="0" allowfullscreen />
    </div>
    <div v-if="side !== 'full'" class="content">
      <slot />
    </div>
    <div v-if="side === 'right'" class="iframe-container">
      <iframe :src="url" :style="iframeStyle" frameborder="0" allowfullscreen />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  url: { type: String, required: true },
  side: { type: String, default: 'full' },
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
  width: 100%;
  height: 100%;
}

.iframe-full {
  overflow: hidden;
}

.iframe-left,
.iframe-right {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.iframe-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.iframe-container iframe {
  border: none;
}

.content {
  padding: 2rem;
  overflow: auto;
}
</style>
