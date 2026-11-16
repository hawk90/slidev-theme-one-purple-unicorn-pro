<template>
  <!-- A process as arrow-shaped steps, left to right; `active` lights one -->
  <div class="chevron-flow" role="list">
    <div
      v-for="(s, i) in items"
      :key="i"
      role="listitem"
      class="chevron"
      :class="{ 'chevron-first': i === 0, 'chevron-active': i === Number(active) - 1, 'chevron-done': Number(active) > 0 && i < Number(active) - 1 }"
      :style="s.color ? { '--_chev': colorValue(s.color) } : undefined"
    >
      <span class="chevron-title" v-html="richText(s.title)" />
      <span v-if="s.desc" class="chevron-desc" v-html="richText(s.desc)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { colorValue } from '../utils/colors'
import { richText } from '../utils/rich-text'

interface Step { title: string, desc?: string, color?: string }

const props = defineProps({
  /** Titles, or { title, desc, color } */
  steps: { type: Array as () => (string | Step)[], required: true },
  /** The step to light (1-based); the ones before it read as done */
  active: { type: [Number, String], default: 0 },
})

const items = computed(() => props.steps.map(s => (typeof s === 'string' ? { title: s } : s)))
</script>

<style scoped>
/* Variables: --chevron-color, --chevron-height (3.5rem) */
.chevron-flow {
  display: flex;
  margin: 1rem 0;
}

.chevron {
  --_chev: var(--chevron-color, var(--primary-400));
  --_tip: calc(var(--chevron-height, 3.5rem) * 0.35);
  flex: 1;
  min-height: var(--chevron-height, 3.5rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: calc(-1 * var(--_tip) + 4px);
  padding: 0.4rem calc(var(--_tip) + 0.6rem);
  clip-path: polygon(0 0, calc(100% - var(--_tip)) 0, 100% 50%, calc(100% - var(--_tip)) 100%, 0 100%, var(--_tip) 50%);
  background: color-mix(in srgb, var(--_chev) 18%, var(--bg-secondary));
  color: var(--text-primary);
  text-align: center;
  transition: background var(--transition-base);
}

.chevron-first {
  margin-left: 0;
  clip-path: polygon(0 0, calc(100% - var(--_tip)) 0, 100% 50%, calc(100% - var(--_tip)) 100%, 0 100%);
  border-radius: 6px 0 0 6px;
}

.chevron-done { background: color-mix(in srgb, var(--_chev) 32%, var(--bg-secondary)); }
.chevron-active { background: var(--_chev); color: #fff; }

.chevron-title { font-weight: 700; font-size: 0.9rem; }
.chevron-desc { font-size: 0.7rem; opacity: 0.8; }
</style>
