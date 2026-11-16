<template>
  <!-- Hexagons in a honeycomb (a triad of three, or more): one idea each -->
  <div class="hex-grid" :style="{ '--_cols': cols, '--_hex': size }">
    <div
      v-for="(h, i) in items"
      :key="i"
      class="hex"
      :class="{ 'hex-shift': shifted(i) }"
      :style="{ '--_hc': h.color ? colorValue(h.color) : undefined, gridColumn: `${col(i) * 2 + (shifted(i) ? 2 : 1)} / span 2`, gridRow: row(i) + 1 }"
    >
      <span v-if="h.icon" class="hex-icon">{{ h.icon }}</span>
      <span class="hex-title" v-html="richText(h.title)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { colorValue } from '../utils/colors'
import { richText } from '../utils/rich-text'

interface Hex { title: string, icon?: string, color?: string }

const props = defineProps({
  /** Titles, or { title, icon, color } */
  items: { type: Array as () => (string | Hex)[], required: true },
  /** Hexagons in a row (3 items: a triad, 2 over 1) */
  columns: { type: [Number, String], default: undefined },
  /** A hexagon's width (9rem) */
  size: { type: String, default: '9rem' },
})

const items = computed(() => props.items.map(h => (typeof h === 'string' ? { title: h } : h)))
// three: two on top, one centered below (a triad); otherwise rows of `columns`
const cols = computed(() => Number(props.columns) || (items.value.length === 3 ? 2 : Math.min(4, items.value.length)))
const row = (i: number) => Math.floor(i / cols.value)
const col = (i: number) => i % cols.value
// every other row sits half a hexagon to the right, as in a honeycomb
const shifted = (i: number) => row(i) % 2 === 1
</script>

<style scoped>
/* Variables: --hex-color */
.hex-grid {
  display: grid;
  /* flat-topped hexagons: a row under another is shifted half a hexagon
     across, a hexagon's height down (with a gap), so none overlap */
  grid-template-columns: repeat(calc(var(--_cols) * 2 + 1), calc(var(--_hex) / 2));
  grid-auto-rows: calc(var(--_hex) * 0.866);
  column-gap: 0.3rem;
  row-gap: 0.3rem;
  justify-content: center;
  margin: 1rem 0;
}

.hex {
  width: var(--_hex);
  aspect-ratio: 1 / 0.866;
  clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  padding: 0 1.2rem;
  background: color-mix(in srgb, var(--_hc, var(--hex-color, var(--primary-400))) 24%, var(--bg-secondary));
  color: var(--text-primary);
  text-align: center;
}

.hex-icon { font-size: 1.3rem; }
.hex-title { font-weight: 700; font-size: 0.8rem; line-height: 1.2; }
</style>
