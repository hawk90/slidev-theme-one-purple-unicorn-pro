<template>
  <!-- Alias kept for backward compatibility: center with preset props -->
  <Base padding="2rem" v-bind="$attrs">
    <slot />
  </Base>
</template>

<script setup lang="ts">
import Base from './center.vue'

defineOptions({ inheritAttrs: false })
</script>
