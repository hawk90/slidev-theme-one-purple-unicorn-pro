<template>
  <div class="slidev-layout full-split" :style="bgStyle">
    <div class="split-panel" :style="panelStyle">
      <div class="split-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  image: { type: String, default: '' },
  backgroundSize: { type: String, default: 'cover' },
  backgroundPosition: { type: String, default: 'center' },
  panelWidth: { type: String, default: '45%' },
  panelSide: { type: String, default: 'left' },
  panelColor: { type: String, default: 'rgba(26, 27, 46, 0.92)' },
})

const bgStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.image) {
    style.backgroundImage = `url(${props.image})`
    style.backgroundSize = props.backgroundSize
    style.backgroundPosition = props.backgroundPosition
    style.backgroundRepeat = 'no-repeat'
  }
  return style
})

const panelStyle = computed(() => ({
  width: props.panelWidth,
  background: props.panelColor,
  [props.panelSide === 'right' ? 'marginLeft' : 'marginRight']: 'auto',
}))
</script>

<style scoped>
.full-split {
  width: 100%;
  height: 100%;
  padding: 0 !important;
  margin: 0;
  position: relative;
}

.split-panel {
  height: 100%;
  display: flex;
  align-items: center;
  backdrop-filter: blur(2px);
}

.split-content {
  padding: 3rem;
  width: 100%;
}

.split-content :deep(h1) {
  position: static;
  height: auto;
  max-height: none;
  font-size: 2rem;
  color: white;
  margin-bottom: 1rem;
}

.split-content :deep(h2) {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.85);
}

.split-content :deep(p) {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.split-content :deep(li) {
  color: rgba(255, 255, 255, 0.8);
}
</style>
