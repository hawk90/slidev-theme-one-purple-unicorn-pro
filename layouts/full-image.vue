<template>
  <div class="slidev-layout full-image" :style="bgStyle">
    <div class="full-image-overlay" :style="overlayStyle" />
    <div class="full-image-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  image: { type: String, required: true },
  backgroundSize: { type: String, default: 'cover' },
  overlay: { type: String, default: 'rgba(0, 0, 0, 0.55)' },
  position: { type: String, default: 'center' },
})

const bgStyle = computed(() => ({
  backgroundImage: `url(${props.image})`,
  backgroundSize: props.backgroundSize,
  backgroundPosition: props.position,
  backgroundRepeat: 'no-repeat',
}))

const overlayStyle = computed(() => ({
  background: props.overlay,
}))
</script>

<style scoped>
.full-image {
  width: 100%;
  height: 100%;
  padding: 0 !important;
  margin: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.full-image-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.full-image-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 52rem;
  padding: 3rem;
}

.full-image-content :deep(h1) {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.15;
  color: white;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
  margin-bottom: 1rem;
}

.full-image-content :deep(h2) {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.4);
}

.full-image-content :deep(p) {
  font-size: 1.15rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}
</style>
