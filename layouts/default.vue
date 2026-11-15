<template>
  <div class="slidev-layout default slide-bg-host">
    <!-- the slide's own `background` / `bg`, behind the content -->
    <SlideBackground />
    <slot />
  </div>
</template>

<script setup lang="ts">
import SlideBackground from '../components/internal/SlideBackground.vue'
</script>

<style scoped>
/* Padding/typography come from the content-slide rules in styles/content.css */
.default {
  @apply h-full;
}
</style>
