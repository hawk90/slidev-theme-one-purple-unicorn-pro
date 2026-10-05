<template>
  <div class="slidev-layout center slide-bare">
    <CenteredSlide :padding="padding" :content-max-width="contentMaxWidth">
      <slot />
    </CenteredSlide>
  </div>
</template>

<script setup lang="ts">
import CenteredSlide from '../components/internal/CenteredSlide.vue'

defineProps({
  padding: { type: String, default: '4rem' },
  contentMaxWidth: { type: String, default: '64rem' },
})
</script>
