<template>
  <div class="slidev-layout image-layout" :class="`image-${side}`">
    <div v-if="side === 'left'" class="image-container" :style="imageStyle" />
    <div class="content">
      <slot />
    </div>
    <div v-if="side === 'right'" class="image-container" :style="imageStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  image: { type: String, required: true },
  side: { type: String, default: 'left' },
  backgroundSize: { type: String, default: 'cover' },
})

const imageStyle = computed(() => ({
  backgroundImage: `url(${props.image})`,
  backgroundSize: props.backgroundSize,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}))
</script>

<style scoped>
.image-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100%;
}

.image-container {
  width: 100%;
  height: 100%;
}

.content {
  padding: 2rem;
  overflow: auto;
}
</style>
