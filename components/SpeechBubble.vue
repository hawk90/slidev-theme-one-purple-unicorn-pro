<template>
  <!-- A speech bubble: a glass bubble with a tail toward the speaker, and an
       optional name (and avatar) beside it. -->
  <div class="speech" :class="`speech-${side}`" :style="style">
    <div v-if="name || avatar" class="speech-who">
      <img v-if="avatar" :src="resolveAssetUrl(avatar)" alt="" class="speech-avatar" />
      <span v-if="name" class="speech-name">{{ name }}</span>
    </div>
    <div class="speech-bubble"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveAssetUrl } from '@slidev/client'
import { colorValue } from '../utils/colors'

const props = defineProps({
  /** Where the speaker is: left (default) or right; the tail points there */
  side: { type: String, default: 'left' },
  name: { type: String, default: '' },
  /** An image path (public/ or a URL) */
  avatar: { type: String, default: '' },
  /** The bubble's tint: a theme color name or any CSS color */
  color: { type: String, default: 'primary' },
})

const side = computed(() => (props.side === 'right' ? 'right' : 'left'))
const style = computed(() => ({ '--_speech': colorValue(props.color) ?? props.color }))
</script>

<style scoped>
/* Variables: --speech-max-width */
.speech {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  margin: 0.5rem 0;
  text-align: left;
}

.speech-right {
  flex-direction: row-reverse;
}

.speech-who {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  flex: none;
}

.speech-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid color-mix(in srgb, var(--_speech) 60%, transparent);
}

.speech-name {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.speech-bubble {
  position: relative;
  max-width: var(--speech-max-width, 28rem);
  padding: 0.7rem 1rem;
  border-radius: 16px;
  background:
    linear-gradient(color-mix(in srgb, var(--_speech) 16%, transparent), color-mix(in srgb, var(--_speech) 16%, transparent)),
    color-mix(in srgb, var(--bg-secondary) 75%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid color-mix(in srgb, var(--_speech) 35%, transparent);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
  color: var(--text-primary);
  font-size: 0.9rem;
  line-height: 1.45;
}

.speech-left .speech-bubble { border-bottom-left-radius: 4px; }
.speech-right .speech-bubble { border-bottom-right-radius: 4px; }

.speech-bubble > :deep(:first-child) { margin-top: 0; }
.speech-bubble > :deep(:last-child) { margin-bottom: 0; }
</style>
