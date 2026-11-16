<template>
  <div class="slidev-layout full-split slide-dark slide-bare">
    <FullBleed
      :image="image"
      :alt="alt"
      :stack="imageStack"
      :poster="poster"
      :background-size="backgroundSize"
      :background-position="backgroundPosition"
      panel
      :panel-width="panelWidth"
      :panel-side="panelSide"
      :panel-color="panelColor"
    >
      <slot />
    </FullBleed>
  </div>
</template>

<script setup lang="ts">
import FullBleed from '../components/internal/FullBleed.vue'

// Unset ones fall through to FullBleed's defaults (cover, center, 45%, left,
// the dark panel), so they are stated once
defineProps({
  // An image or a video, or a list of up to three
  image: { type: [String, Array], default: '' },
  // Several: side by side (row, default) or stacked (column)
  imageStack: { type: String, default: 'row' },
  // A video's poster: before it plays, and in exports
  poster: { type: String, default: '' },
  backgroundSize: { type: String, default: undefined },
  backgroundPosition: { type: String, default: undefined },
  panelWidth: { type: String, default: undefined },
  panelSide: { type: String, default: undefined },
  panelColor: { type: String, default: undefined },
  // What the picture shows, for screen readers (empty: decoration)
  alt: { type: String, default: '' },
})
</script>
