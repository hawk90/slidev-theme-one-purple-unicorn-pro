<template>
  <!-- The media of image / full-image / full-split: one to three pictures or
       videos, tiled side by side (or stacked), each filling its tile. A video
       is Slidev's <SlidevVideo>: muted, looping, playing while its slide is
       shown; an export shows its poster (or its first frame). -->
  <div class="media-fill" :class="`media-fill-${stack}`" :style="{ '--_tiles': sources.length }">
    <template v-for="(src, i) in sources" :key="`${i}-${src}`">
      <SlidevVideo
        v-if="isVideo(src)"
        class="media-fill-tile media-fill-video"
        :style="{ objectFit: fit, objectPosition: position }"
        autoplay
        autoreset="slide"
        :poster="poster ? resolveAssetUrl(poster) : undefined"
        muted
        loop
        playsinline
      >
        <source :src="resolveAssetUrl(src)">
      </SlidevVideo>
      <div v-else class="media-fill-tile" :style="backgroundImageStyle(resolveAssetUrl(src), size, position)" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveAssetUrl } from '@slidev/client'
import { backgroundImageStyle, isVideo, mediaList } from '../../utils/media'

const props = defineProps({
  /** One path, or a list of up to three */
  src: { type: [String, Array], default: '' },
  size: { type: String, default: 'cover' },
  position: { type: String, default: 'center' },
  /** row (side by side, default) | column (stacked) */
  stack: { type: String, default: 'row' },
  /** A video's poster: shown before it plays, and in exports */
  poster: { type: String, default: '' },
})

const sources = computed(() => mediaList(props.src))
const stack = computed(() => (props.stack === 'column' ? 'column' : 'row'))
// background-size words for a <video>: cover / contain
const fit = computed(() => (props.size === 'contain' ? 'contain' : 'cover'))
</script>

<style scoped>
/* Variables: --media-gap (between tiles, 4px) */
.media-fill {
  display: grid;
  gap: var(--media-gap, 4px);
  width: 100%;
  height: 100%;
}
.media-fill-row { grid-template-columns: repeat(var(--_tiles), 1fr); }
.media-fill-column { grid-template-rows: repeat(var(--_tiles), 1fr); }

.media-fill-tile {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.media-fill-video {
  display: block;
  background: #000;
}
</style>
