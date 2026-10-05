<template>
  <div class="slidev-layout intro slide-dark slide-bare">
    <CenteredSlide dark :padding="padding" :content-max-width="contentMaxWidth" :align="align">
      <slot />
    </CenteredSlide>
  </div>
</template>

<script setup lang="ts">
import CenteredSlide from '../components/internal/CenteredSlide.vue'

defineProps({
  padding: { type: String, default: '4rem 6rem' },
  contentMaxWidth: { type: String, default: '52rem' },
  align: { type: String, default: 'left' },
})
</script>
