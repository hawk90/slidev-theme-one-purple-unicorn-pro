<template>
  <!-- A browser window: macOS dots, a tab with the title, an address bar,
       and the page: an image (`src`), a live page (`iframe`) or the slot -->
  <div class="device-browser" :style="width ? { width } : undefined">
    <div class="browser-bar">
      <span class="macos-traffic-lights">
        <span class="macos-traffic-light close" />
        <span class="macos-traffic-light minimize" />
        <span class="macos-traffic-light maximize" />
      </span>
      <span class="browser-nav" aria-hidden="true">‹ ›</span>
      <span class="browser-url">
        <span class="browser-lock" aria-hidden="true">{{ secure ? '🔒' : 'ⓘ' }}</span>
        <span class="browser-url-text">{{ shownUrl }}</span>
      </span>
    </div>
    <div class="browser-page" :style="height ? { height } : undefined">
      <iframe v-if="iframe" :src="url" :title="title || shownUrl" loading="lazy" class="browser-iframe" />
      <img v-else-if="src" :src="resolveAssetUrl(src)" :alt="alt" class="browser-img">
      <slot v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveAssetUrl } from '@slidev/client'

const props = defineProps({
  /** The address shown (and loaded, with `iframe`) */
  url: { type: String, default: '' },
  title: { type: String, default: '' },
  /** A screenshot to show as the page */
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  /** Load `url` live in the window */
  iframe: { type: Boolean, default: false },
  width: { type: String, default: '' },
  /** The page's height (the window's minus its bar); auto by default */
  height: { type: String, default: '' },
})

const secure = computed(() => !props.url || props.url.startsWith('https://'))
const shownUrl = computed(() => props.url.replace(/^https?:\/\//, '').replace(/\/$/, ''))
</script>

<style scoped>
/* Variables: --browser-bar-bg, --browser-url-bg */
.device-browser {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--_root-border-default, rgba(171, 178, 191, 0.15));
  box-shadow: var(--shadow-xl, 0 20px 40px rgba(0, 0, 0, 0.35));
  background: var(--bg-secondary);
}

.browser-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.45rem 0.75rem;
  background: var(--browser-bar-bg, var(--code-title-bg, #1b1e23));
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--_root-text-muted, #858c98);
}

.browser-nav {
  letter-spacing: 0.3em;
  opacity: 0.6;
}

.browser-url {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  background: var(--browser-url-bg, rgba(255, 255, 255, 0.06));
  color: var(--_root-text-secondary, #a9b1d6);
}

.browser-lock { font-size: 0.55rem; opacity: 0.8; }

.browser-url-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.browser-page {
  position: relative;
  flex: 1 1 auto; /* its own height when given (`height`), else the content's */
  min-height: 0;
  overflow: hidden;
}

.browser-page .browser-img {
  display: block;
  width: 100%;
  height: 100%;
  max-height: none;
  object-fit: cover;
  object-position: top;
  margin: 0;
  border-radius: 0;
}

.browser-iframe {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 16rem;
  border: 0;
  background: #fff;
}
</style>
