<template>
  <iframe
    class="scaled-iframe"
    :src="src"
    :style="scaleStyle"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  scale: { type: [Number, String], default: 1 },
})

// Render at 1/scale size, then scale back down to fill the container
const scaleStyle = computed(() => {
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
.scaled-iframe {
  border: none;
}
</style>
