<template>
  <div class="slidev-layout intro slide-title slide-dark slide-bare">
    <CenteredSlide dark :padding="padding" :content-max-width="contentMaxWidth" :align="align">
      <slot />
    </CenteredSlide>
  </div>
</template>

<script setup lang="ts">
import CenteredSlide from '../components/internal/CenteredSlide.vue'
import { centeredLayoutProps } from '../utils/layout-props'

defineProps({
  ...centeredLayoutProps('52rem'),
  align: { type: String, default: 'left' },
})
</script>
