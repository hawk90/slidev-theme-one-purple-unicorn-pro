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
  image: { type: String, default: '' },
  backgroundSize: { type: String, default: undefined },
  backgroundPosition: { type: String, default: undefined },
  panelWidth: { type: String, default: undefined },
  panelSide: { type: String, default: undefined },
  panelColor: { type: String, default: undefined },
  // What the picture shows, for screen readers (empty: decoration)
  alt: { type: String, default: '' },
})
</script>
