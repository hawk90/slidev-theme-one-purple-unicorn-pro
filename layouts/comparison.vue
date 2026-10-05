<template>
  <!-- Alias kept for backward compatibility: two-cols with preset props -->
  <Base divider leftLabel="Before" rightLabel="After" v-bind="$attrs">
    <slot />
    <template #left><slot name="left" /></template>
    <template #right><slot name="right" /></template>
    <template #bottom><slot name="bottom" /></template>
  </Base>
</template>

<script setup lang="ts">
import Base from './two-cols.vue'

defineOptions({ inheritAttrs: false })
</script>
