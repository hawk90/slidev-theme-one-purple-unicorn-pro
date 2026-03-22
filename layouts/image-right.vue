<template>
  <div class="slidev-layout image-right">
    <div class="content">
      <slot />
    </div>
    <div class="image-container" :style="imageStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  image: { type: String, required: true },
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
.image-right {
  display: grid;
  grid-template-columns: 1fr 1fr;
  @apply w-full h-full;
}

.image-container {
  @apply w-full h-full;
}

.content {
  @apply p-8 overflow-auto;
}
</style>
