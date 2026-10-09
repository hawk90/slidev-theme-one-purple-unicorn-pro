<template>
  <div class="qrcode" :class="presetSize ? `qrcode-${size}` : ''" :style="presetSize ? undefined : { '--qrcode-size': size }">
    <component
      :is="isLink ? 'a' : 'div'"
      class="qrcode-box"
      v-bind="isLink ? { href: target, target: '_blank', rel: 'noopener' } : {}"
      :title="target"
    >
      <img v-if="imageSrc" :src="imageSrc" :alt="`QR: ${target}`" class="qrcode-img" />
      <svg
        v-else-if="matrix"
        class="qrcode-img"
        :viewBox="`0 0 ${matrix.size + 2 * BORDER} ${matrix.size + 2 * BORDER}`"
        role="img"
        :aria-label="`QR: ${target}`"
      >
        <path :d="path" />
      </svg>
    </component>
    <div v-if="caption" class="qrcode-caption">{{ caption }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import type { Ecc } from '../utils/qr'
import { encodeQr, qrPath } from '../utils/qr'

const props = defineProps({
  // What the code holds; empty: this deck's address (see `slide`)
  url: { type: String, default: '' },
  // Without `url`: true links to the slide it's on, a number to that slide
  slide: { type: [Boolean, Number], default: false },
  caption: { type: String, default: '' },
  // sm | default | lg | xl, or any CSS length (e.g. "150px")
  size: { type: String, default: 'default' },
  // Error correction L | M | Q | H; raised for free when the symbol has room
  ecc: { type: String, default: 'M' },
  // Use a QR image service instead ({data}: the encoded url, {size}: pixels)
  api: { type: String, default: '' },
  // Use your own image instead
  src: { type: String, default: '' },
})

// Quiet zone in modules; the white box's padding adds to it
const BORDER = 2

const { $page: page, $slidev: slidev } = useSlideContext()

// The deck's public address: `seoMeta.ogUrl` if set, else where it is served
// (in an export that is the local export server)
const target = computed(() => {
  if (props.url) return props.url
  const og = slidev.configs.seoMeta?.ogUrl
  const root = og ? og.replace(/\/?$/, '/') : location.origin + import.meta.env.BASE_URL
  if (props.slide === false) return root
  const no = props.slide === true ? page.value : props.slide
  const mode = slidev.configs.routerMode
  if (mode === 'memory') return root // no per-slide URLs
  return mode === 'hash' ? `${root}#/${no}` : `${root}${no}`
})

const isLink = computed(() => /^https?:\/\//i.test(target.value))

const presetSize = computed(() => ['sm', 'default', 'lg', 'xl'].includes(props.size))
const PRESET_PX: Record<string, number> = { sm: 80, default: 120, lg: 180, xl: 240 }

const imageSrc = computed(() => {
  if (props.src) return props.src
  if (!props.api) return ''
  // Twice the shown size (480px for custom lengths), so the image is not upscaled
  const px = (PRESET_PX[props.size] ?? 240) * 2
  return props.api.replace('{data}', encodeURIComponent(target.value)).replace('{size}', String(px))
})

const level = computed<Ecc>(() => {
  const e = String(props.ecc).toUpperCase()
  return (['L', 'M', 'Q', 'H'].includes(e) ? e : 'M') as Ecc
})
// Encoded once per text and level; the SVG scales without blurring. Text past
// a QR code's capacity (about 2.9 KB) shows no code rather than breaking the slide
const matrix = computed(() => {
  try {
    return encodeQr(target.value, level.value)
  }
  catch (e) {
    console.warn('[theme] QRCode:', e)
    return null
  }
})
const path = computed(() => (matrix.value ? qrPath(matrix.value, BORDER) : ''))
</script>

<style scoped>
.qrcode {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.qrcode-box {
  display: block;
  line-height: 0;
  /* themes and Slidev style links; the code itself must stay untouched */
  border: 0 !important;
  text-decoration: none !important;
}

.qrcode-img {
  display: block;
  width: var(--qrcode-size, 120px);
  height: var(--qrcode-size, 120px);
  border-radius: 0.5rem;
  background: white;
  padding: 0.5rem;
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.3));
  /* Hard module edges: blurred seams make a code hard to scan */
  image-rendering: pixelated;
}

svg.qrcode-img {
  shape-rendering: crispEdges;
}

svg.qrcode-img path {
  fill: #000;
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
