<template>
  <div
    v-if="target !== null || imageSrc || !isPrintMode"
    class="qrcode"
    :class="presetSize ? `qrcode-${size}` : ''"
    :style="presetSize ? undefined : { '--qrcode-size': size }"
  >
    <component
      :is="isLink ? 'a' : 'div'"
      class="qrcode-box"
      v-bind="isLink ? { href: target, target: '_blank', rel: 'noopener' } : {}"
      :title="target ?? undefined"
    >
      <img v-if="imageSrc" :src="imageSrc" :alt="target ? `QR: ${target}` : 'QR code'" class="qrcode-img" />
      <svg
        v-else-if="matrix"
        class="qrcode-img"
        :viewBox="`0 0 ${matrix.size + 2 * BORDER} ${matrix.size + 2 * BORDER}`"
        role="img"
        :aria-label="`QR: ${target}`"
      >
        <path :d="path" />
      </svg>
      <!-- No address to give (dev server, export, unsafe url): say so, never a dead code -->
      <div
        v-else-if="target === null"
        class="qrcode-img qrcode-missing"
        title="Set url, or seoMeta.ogUrl in the headmatter"
      >
        No public URL
      </div>
    </component>
    <div v-if="caption" class="qrcode-caption">{{ caption }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'
import { deckUrl, isHttp, isSafeTarget } from '../utils/deck-url'
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

const { isPrintMode } = useNav()

// What the code holds: `url`, else the deck's public address (`seoMeta.ogUrl`,
// else where it is served if that host is public; see utils/deck-url.ts).
// Null when there is none: a dev server or an export runs on localhost, and a
// code for it would be a dead link. A javascript:/data: url is refused.
const target = computed<string | null>(() => {
  if (props.url) return isSafeTarget(props.url) ? props.url : null
  return deckUrl({
    ogUrl: slidev.configs.seoMeta?.ogUrl,
    origin: location.origin,
    base: import.meta.env.BASE_URL,
    routerMode: slidev.configs.routerMode,
    slide: props.slide === false ? undefined : props.slide === true ? page.value : props.slide,
  })
})

watchEffect(() => {
  if (target.value !== null || props.src) return
  console.warn(props.url
    ? `[theme] QRCode: refused url "${props.url}" (unsafe scheme)`
    : '[theme] QRCode: no public address for this deck; set `url` or `seoMeta.ogUrl`')
})

const isLink = computed(() => target.value !== null && isHttp(target.value))

const presetSize = computed(() => ['sm', 'default', 'lg', 'xl'].includes(props.size))
const PRESET_PX: Record<string, number> = { sm: 80, default: 120, lg: 180, xl: 240 }

const imageSrc = computed(() => {
  if (props.src) return props.src
  if (!props.api || target.value === null) return ''
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
  if (target.value === null) return null
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
  border: 0;
  text-decoration: none;
}

/* …nor the theme's hover underline bar (main.css a::after), as LinkCard */
.qrcode-box::after {
  display: none;
}

.qrcode-img {
  display: block;
  width: var(--qrcode-size, 120px);
  height: var(--qrcode-size, 120px);
  border-radius: 0.5rem;
  background: white;
  padding: 0.5rem;
  box-shadow: var(--shadow-md);
  /* Hard module edges: blurred seams make a code hard to scan */
  image-rendering: pixelated;
}

.qrcode-missing {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.65rem;
  line-height: 1.3;
  color: var(--text-muted);
  background: transparent;
  border: 2px dashed currentColor;
  box-shadow: none;
}

svg.qrcode-img {
  shape-rendering: crispEdges;
}

svg.qrcode-img path {
  fill: #000;
}

.qrcode-caption {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-align: center;
}

/* Size presets set --qrcode-size; size="150px" or an inline --qrcode-size wins */
.qrcode-sm { --qrcode-size: 80px; }
.qrcode-lg { --qrcode-size: 180px; }
.qrcode-xl { --qrcode-size: 240px; }
</style>
