<template>
  <!-- A live site in a browser bar, with a way out when the network fails:
       a status dot (connecting / live / offline), a "video" toggle to a
       recording, and in exports the `poster` image. If the page hasn't
       loaded within `timeout` ms (or the room is offline) it switches to the
       video by itself. `scale` shrinks a desktop page to fit; `crop` hides
       that many pixels at its top (a site's own header). -->
  <div class="live-demo" :style="{ width }">
    <div class="ld-bar">
      <span class="ld-dot" :class="`ld-${state}`" :title="state" />
      <span class="ld-url">{{ label || src }}</span>
      <button v-if="video" type="button" class="ld-btn" @click="showVideo = !showVideo" @keydown.space.stop>
        {{ showVideo ? 'live' : 'video' }}
      </button>
      <a class="ld-btn" :href="src" target="_blank" rel="noopener" title="Open in a new tab">↗</a>
    </div>
    <div class="ld-frame" :style="{ height }">
      <img v-if="print && poster" :src="resolveAssetUrl(poster)" :alt="label || src" class="ld-fill">
      <video
        v-else-if="showVideo && video"
        :src="resolveAssetUrl(video)"
        :poster="poster ? resolveAssetUrl(poster) : undefined"
        class="ld-fill"
        autoplay
        muted
        loop
        playsinline
      />
      <iframe
        v-else-if="!print"
        :src="src"
        :title="label || src"
        class="ld-iframe"
        :style="iframeStyle"
        loading="lazy"
        allow="clipboard-read; clipboard-write; fullscreen"
        @load="loaded"
      />
      <div v-else class="ld-offline">{{ src }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { resolveAssetUrl, useNav } from '@slidev/client'

const props = defineProps({
  src: { type: String, required: true },
  /** A recording to fall back on */
  video: { type: String, default: '' },
  /** The still for exports (and the video's first frame) */
  poster: { type: String, default: '' },
  label: { type: String, default: '' },
  height: { type: String, default: '20rem' },
  width: { type: String, default: '100%' },
  /** The page's zoom: 0.5 shows a 2× wider page */
  scale: { type: Number, default: 1 },
  /** Pixels hidden at the page's top */
  crop: { type: Number, default: 0 },
  /** ms to wait for the page before switching to the video */
  timeout: { type: Number, default: 8000 },
})

const { isPrintMode } = useNav()
const print = computed(() => isPrintMode.value)
const state = ref<'connecting' | 'live' | 'offline'>('connecting')
const showVideo = ref(false)

let timer = 0
onMounted(() => {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return offline()
  timer = window.setTimeout(() => { if (state.value === 'connecting') offline() }, props.timeout)
})
onUnmounted(() => clearTimeout(timer))

function offline() {
  state.value = 'offline'
  if (props.video) showVideo.value = true
}
function loaded() {
  clearTimeout(timer)
  state.value = 'live'
}

const iframeStyle = computed(() => {
  const s = props.scale || 1
  return {
    width: `${100 / s}%`,
    height: `calc(${100 / s}% + ${props.crop}px)`,
    transform: `translateY(${-props.crop * s}px) scale(${s})`,
  }
})
</script>

<style scoped>
.live-demo {
  margin: 0.5rem auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  background: var(--bg-secondary);
}

.ld-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.6rem;
  border-bottom: 1px solid var(--border-default);
  font-size: 0.7rem;
}

.ld-dot {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.ld-connecting { background: var(--one-dark-yellow); animation: ld-pulse 1s ease-in-out infinite alternate; }
.ld-live { background: var(--one-dark-green); box-shadow: 0 0 6px var(--one-dark-green); }
.ld-offline { background: var(--one-dark-red); }
@keyframes ld-pulse { to { opacity: 0.3; } }

.ld-url {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-mono);
  color: var(--text-secondary);
}

.ld-btn {
  padding: 0.05rem 0.5rem;
  border: 1px solid var(--border-default);
  border-radius: 999px;
  background: none;
  color: var(--text-secondary);
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}
.ld-btn:hover { color: var(--primary-400); border-color: var(--primary-400); }

.ld-frame {
  position: relative;
  overflow: hidden;
  background: #fff;
}

.ld-iframe {
  display: block;
  border: 0;
  transform-origin: 0 0;
}

.ld-fill {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: 0;
  object-fit: cover;
  object-position: top;
}

div.ld-offline {
  display: grid;
  place-items: center;
  height: 100%;
  width: auto;
  border-radius: 0;
  background: var(--bg-secondary);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.8rem;
}

.print-mode .ld-btn { display: none; }
</style>
