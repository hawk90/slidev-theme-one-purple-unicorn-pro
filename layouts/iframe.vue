<template>
  <div class="slidev-layout iframe-layout slide-bare">
    <div v-if="side === 'full'" class="iframe-full">
      <ScaledIframe :src="url" :scale="scale" :title="label" />
    </div>
    <MediaPanel v-else :src="url" type="iframe" :side="side" :scale="scale" :title="label">
      <slot />
    </MediaPanel>
  </div>
</template>

<script setup lang="ts">
import MediaPanel from '../components/internal/MediaPanel.vue'
import { computed } from 'vue'
import ScaledIframe from '../components/internal/ScaledIframe.vue'

const props = defineProps({
  url: { type: String, required: true },
  side: { type: String, default: 'full' },
  scale: { type: [Number, String], default: 1 },
  // The embedded page's name for screen readers. Not `title`: that is
  // Slidev's slide title (overview, <Toc>), so setting it renamed the slide
  iframeTitle: { type: String, default: undefined },
})

const label = computed(() => props.iframeTitle)
</script>

<style scoped>
.iframe-full {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
