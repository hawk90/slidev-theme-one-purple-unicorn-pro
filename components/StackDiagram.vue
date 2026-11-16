<template>
  <!-- A software stack, top layer first (App → cuBLAS → Runtime → Driver →
       GPU); `active` lights one layer, and a layer can note what it adds -->
  <div class="stack-diagram" role="list">
    <div
      v-for="(l, i) in items"
      :key="i"
      role="listitem"
      class="sd-layer"
      :class="{ 'sd-active': activeIndex === i, 'sd-dimmed': activeIndex >= 0 && activeIndex !== i }"
      :style="{ '--_sd': colorValue(l.color) ?? undefined, '--_depth': i / Math.max(1, items.length - 1) }"
    >
      <span class="sd-label" v-html="richText(l.title)" />
      <span v-if="l.note" class="sd-note" v-html="richText(l.note)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { colorValue } from '../utils/colors'
import { richText } from '../utils/rich-text'

interface Layer { title: string, note?: string, color?: string }

const props = defineProps({
  /** Top first: titles, or { title, note, color } */
  layers: { type: Array as () => (string | Layer)[], required: true },
  /** A layer to light: its title or its place (1-based) */
  active: { type: [String, Number], default: '' },
})

const items = computed(() => props.layers.map(l => (typeof l === 'string' ? { title: l } : l)))
const activeIndex = computed(() => {
  if (props.active === '' || props.active === undefined) return -1
  const n = Number(props.active)
  if (Number.isInteger(n) && n > 0) return n - 1
  return items.value.findIndex(l => l.title === props.active)
})
</script>

<style scoped>
/* Variables: --stack-color (the top layer's; lower ones darken toward the hardware) */
.stack-diagram {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 1rem 0;
}

.sd-layer {
  --_c: var(--_sd, var(--stack-color, var(--primary-400)));
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.55rem 1rem;
  border-radius: 6px;
  background: color-mix(in srgb, var(--_c) calc(12% + var(--_depth) * 22%), var(--bg-secondary));
  border-left: 4px solid var(--_c);
  color: var(--text-primary);
  transition: opacity var(--motion-base, 0.4s), background var(--motion-base, 0.4s);
}

.sd-active { background: var(--_c); color: #fff; }
.sd-active .sd-note { color: rgba(255, 255, 255, 0.85); }
.sd-dimmed { opacity: 0.5; }

.sd-label { font-weight: 700; font-size: 0.85rem; font-family: var(--font-mono); }
.sd-note { font-size: 0.75rem; color: var(--text-secondary); text-align: right; }
</style>
