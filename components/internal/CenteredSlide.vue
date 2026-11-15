<template>
  <!-- The background is the layout root's (--slide-bg; dark layouts: slide-dark),
       and the slide's own `background` / `bg` on a layer behind the content -->
  <div class="centered-slide slide-bg-host" :style="{ padding }">
    <SlideBackground />
    <div class="centered-content" :style="{ maxWidth: contentMaxWidth, textAlign: align }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import SlideBackground from './SlideBackground.vue'

defineProps({
  padding: { type: String, default: '4rem 6rem' },
  contentMaxWidth: { type: String, default: '52rem' },
  align: { type: String, default: 'center' },
})
</script>

<style scoped>
.centered-slide {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.centered-content {
  width: 100%;
}
</style>
