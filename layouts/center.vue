<template>
  <div class="slidev-layout center slide-bare">
    <CenteredSlide :padding="padding" :content-max-width="contentMaxWidth">
      <slot />
    </CenteredSlide>
  </div>
</template>

<script setup lang="ts">
import CenteredSlide from '../components/internal/CenteredSlide.vue'
import { centeredLayoutProps } from '../utils/layout-props'

defineProps(centeredLayoutProps('64rem', '4rem'))
</script>
