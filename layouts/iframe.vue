<template>
  <div class="slidev-layout iframe-layout slide-bare">
    <div v-if="side === 'full'" class="iframe-full">
      <ScaledIframe :src="url" :scale="scale" :title="title" />
    </div>
    <MediaPanel v-else :src="url" type="iframe" :side="side" :scale="scale" :title="title">
      <slot />
    </MediaPanel>
  </div>
</template>

<script setup lang="ts">
import MediaPanel from '../components/internal/MediaPanel.vue'
import ScaledIframe from '../components/internal/ScaledIframe.vue'

defineProps({
  url: { type: String, required: true },
  side: { type: String, default: 'full' },
  scale: { type: [Number, String], default: 1 },
  title: { type: String, default: undefined },
})
</script>

<style scoped>
.iframe-full {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
