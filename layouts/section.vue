<template>
  <div class="slidev-layout section slide-title slide-dark slide-bare">
    <CenteredSlide :padding="padding" :content-max-width="contentMaxWidth">
      <slot />
    </CenteredSlide>
  </div>
</template>

<script setup lang="ts">
import CenteredSlide from '../components/internal/CenteredSlide.vue'
import { centeredLayoutProps } from '../utils/layout-props'

defineProps(centeredLayoutProps('48rem'))
</script>
