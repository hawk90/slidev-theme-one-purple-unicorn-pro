<template>
  <!-- A phone: rounded body, a camera island, the screen showing an image
       (`src`), a live page (`url`) or the slot -->
  <div class="device-phone" :style="{ '--_phone-w': width }">
    <div class="phone-screen">
      <iframe v-if="url" :src="url" :title="title || url" loading="lazy" class="phone-iframe" />
      <img v-else-if="src" :src="resolveAssetUrl(src)" :alt="alt" class="phone-img">
      <slot v-else />
      <span class="phone-island" aria-hidden="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { resolveAssetUrl } from '@slidev/client'

defineProps({
  /** A screenshot to show on the screen */
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  /** A page to load live on the screen */
  url: { type: String, default: '' },
  title: { type: String, default: '' },
  /** The phone's width (14rem); its height follows (19.5:9) */
  width: { type: String, default: '14rem' },
})
</script>

<style scoped>
/* Variables: --phone-frame (the body's color) */
.device-phone {
  display: inline-block;
  width: var(--_phone-w);
  aspect-ratio: 9 / 19.5;
  padding: calc(var(--_phone-w) * 0.035);
  border-radius: calc(var(--_phone-w) * 0.16);
  background: var(--phone-frame, linear-gradient(145deg, #2c2f36, #16181d));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.4),
    var(--shadow-xl, 0 20px 40px rgba(0, 0, 0, 0.35));
}

.phone-screen {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: calc(var(--_phone-w) * 0.13);
  background: var(--bg-secondary);
}

.phone-island {
  position: absolute;
  top: calc(var(--_phone-w) * 0.035);
  left: 50%;
  translate: -50% 0;
  width: 32%;
  height: calc(var(--_phone-w) * 0.085);
  border-radius: 999px;
  background: #000;
}

.phone-img,
.phone-iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  margin: 0;
  border-radius: 0;
  object-fit: cover;
  object-position: top;
}
</style>
