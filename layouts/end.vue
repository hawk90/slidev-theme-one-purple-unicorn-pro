<template>
  <div class="slidev-layout end slide-dark slide-bare">
    <CenteredSlide dark :padding="padding" :content-max-width="contentMaxWidth">
      <slot />
    </CenteredSlide>
  </div>
</template>

<script setup lang="ts">
import CenteredSlide from '../components/internal/CenteredSlide.vue'
import { centeredLayoutProps } from '../utils/layout-props'

defineProps(centeredLayoutProps('48rem'))
</script>
