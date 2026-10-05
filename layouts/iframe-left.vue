<template>
  <!-- Alias kept for backward compatibility: iframe with preset props -->
  <Base side="left" v-bind="$attrs">
    <slot />
  </Base>
</template>

<script setup lang="ts">
import Base from './iframe.vue'

defineOptions({ inheritAttrs: false })
</script>
