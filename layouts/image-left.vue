<template>
  <!-- Alias kept for backward compatibility: image with preset props -->
  <Base side="left" v-bind="$attrs">
    <slot />
  </Base>
</template>

<script setup lang="ts">
import Base from './image.vue'

defineOptions({ inheritAttrs: false })
</script>
