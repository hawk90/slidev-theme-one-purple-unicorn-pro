<template>
  <div class="slidev-layout image-layout slide-bare">
    <MediaPanel :src="image" type="image" :side="side" :background-size="backgroundSize" :alt="alt" :width="imageWidth" :stack="imageStack" :poster="poster">
      <slot />
    </MediaPanel>
  </div>
</template>

<script setup lang="ts">
import MediaPanel from '../components/internal/MediaPanel.vue'

defineProps({
  // An image or a video (.mp4, .webm …), or a list of up to three
  image: { type: [String, Array], required: true },
  // Several: side by side (row, default) or stacked (column)
  imageStack: { type: String, default: 'row' },
  // A video's poster: before it plays, and in exports
  poster: { type: String, default: '' },
  side: { type: String, default: 'left' },
  backgroundSize: { type: String, default: 'cover' },
  alt: { type: String, default: '' },
  // The media column's width: "40%", 0.4, "2/5" (50% by default)
  imageWidth: { type: [String, Number], default: undefined },
})
</script>
