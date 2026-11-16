<template>
  <!-- A sticky note: a small, slightly turned glass card in a color, for an
       aside pinned onto a slide. Place it with classes (absolute right-8 top-20)
       or inline. -->
  <div class="sticky-note" :style="style">
    <div v-if="title" class="sticky-note-title">{{ title }}</div>
    <div class="sticky-note-body"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { colorValue } from '../utils/colors'

const props = defineProps({
  /** A theme color name (yellow by default) or any CSS color */
  color: { type: String, default: 'yellow' },
  /** Degrees it is turned (−1.5 by default; 0 for straight) */
  rotate: { type: [Number, String], default: -1.5 },
  title: { type: String, default: '' },
  /** CSS width (14rem by default) */
  width: { type: String, default: '' },
})

const style = computed(() => ({
  '--_note': colorValue(props.color) ?? props.color,
  '--_note-rotate': `${Number(props.rotate) || 0}deg`,
  ...(props.width ? { width: props.width } : {}),
}))
</script>

<style scoped>
/* Variables: --sticky-note-width, --sticky-note-text */
.sticky-note {
  position: relative;
  display: inline-block;
  width: var(--sticky-note-width, 14rem);
  padding: 0.9rem 1rem 1rem;
  rotate: var(--_note-rotate);
  border-radius: 4px 4px 12px 4px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--_note) 30%, transparent), color-mix(in srgb, var(--_note) 18%, transparent)),
    color-mix(in srgb, var(--bg-secondary) 70%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid color-mix(in srgb, var(--_note) 45%, transparent);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22), inset 0 1px rgba(255, 255, 255, 0.12);
  color: var(--sticky-note-text, var(--text-primary));
  font-size: 0.85rem;
  line-height: 1.45;
  text-align: left;
}

/* a strip of tape at the top */
.sticky-note::before {
  content: '';
  position: absolute;
  top: -0.55rem;
  left: 50%;
  width: 3.5rem;
  height: 1.1rem;
  translate: -50% 0;
  rotate: calc(-1 * var(--_note-rotate) + 2deg);
  background: color-mix(in srgb, var(--text-primary) 12%, transparent);
  border-radius: 2px;
}

.sticky-note-title {
  margin-bottom: 0.35rem;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.02em;
  color: color-mix(in srgb, var(--_note) 70%, var(--text-primary));
}

.sticky-note-body > :deep(:first-child) { margin-top: 0; }
.sticky-note-body > :deep(:last-child) { margin-bottom: 0; }
</style>
