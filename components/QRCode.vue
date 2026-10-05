<template>
  <div class="qrcode" :class="presetSize ? `qrcode-${size}` : ''" :style="presetSize ? undefined : { '--qrcode-size': size }">
    <img
      :src="imageSrc"
      :alt="`QR: ${url}`"
      class="qrcode-img"
    />
    <div v-if="caption" class="qrcode-caption">{{ caption }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  url: { type: String, required: true },
  caption: { type: String, default: '' },
  // sm | default | lg | xl, or any CSS length (e.g. "150px")
  size: { type: String, default: 'default' },
  // QR image service; {data} is replaced with the encoded url
  api: { type: String, default: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={data}' },
  // Use your own image instead of the service
  src: { type: String, default: '' },
})

const presetSize = computed(() => ['sm', 'default', 'lg', 'xl'].includes(props.size))
const imageSrc = computed(() => props.src || props.api.replace('{data}', encodeURIComponent(props.url)))
</script>

<style scoped>
.qrcode {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.qrcode-img {
  width: var(--qrcode-size, 120px);
  height: var(--qrcode-size, 120px);
  border-radius: 0.5rem;
  background: white;
  padding: 0.5rem;
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.3));
}

.qrcode-caption {
  font-size: 0.7rem;
  color: var(--text-muted, #5c6370);
  text-align: center;
}

/* Size presets set --qrcode-size; size="150px" or an inline --qrcode-size wins */
.qrcode-sm { --qrcode-size: 80px; }
.qrcode-lg { --qrcode-size: 180px; }
.qrcode-xl { --qrcode-size: 240px; }
</style>
