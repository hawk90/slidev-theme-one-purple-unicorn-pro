<template>
  <!-- A cycle: items around a ring with arrows between them, and an optional
       word in the middle (a loop, an orbit) -->
  <div class="cycle" :style="{ '--_size': size }">
    <svg class="cycle-ring" viewBox="-100 -100 200 200" aria-hidden="true">
      <defs>
        <marker :id="arrowId" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" class="cycle-arrowhead" />
        </marker>
      </defs>
      <path v-for="(a, i) in arcs" :key="i" :d="a" class="cycle-arc" :marker-end="`url(#${arrowId})`" />
    </svg>
    <div v-if="center" class="cycle-center" v-html="richText(center)" />
    <div
      v-for="(it, i) in items"
      :key="i"
      class="cycle-item"
      :style="{ left: `${50 + 42 * Math.sin(angle(i))}%`, top: `${50 - 42 * Math.cos(angle(i))}%`, '--_cyc': it.color ? colorValue(it.color) : undefined }"
    >
      <span v-html="richText(it.title)" />
    </div>
  </div>
</template>

<script lang="ts">
let nextId = 0
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { colorValue } from '../utils/colors'
import { richText } from '../utils/rich-text'

interface Item { title: string, color?: string }

const props = defineProps({
  /** Titles, or { title, color }, clockwise from the top */
  items: { type: Array as () => (string | Item)[], required: true },
  center: { type: String, default: '' },
  /** The diagram's width and height (20rem) */
  size: { type: String, default: '20rem' },
})

const arrowId = `cycle-arrow-${nextId++}`
const items = computed(() => props.items.map(it => (typeof it === 'string' ? { title: it } : it)))
const angle = (i: number) => (i / items.value.length) * 2 * Math.PI

// Arcs on the ring (radius 84 of 100) from item to item, leaving room for them
const arcs = computed(() => {
  const n = items.value.length
  if (n < 2) return []
  const r = 84
  const gap = Math.min(0.42, Math.PI / n * 0.55)
  return items.value.map((_, i) => {
    const a = angle(i) + gap
    const b = angle(i + 1) - gap
    const p = (t: number) => `${(r * Math.sin(t)).toFixed(2)} ${(-r * Math.cos(t)).toFixed(2)}`
    return `M ${p(a)} A ${r} ${r} 0 0 1 ${p(b)}`
  })
})
</script>

<style scoped>
/* Variables: --cycle-color */
.cycle {
  position: relative;
  width: var(--_size);
  height: var(--_size);
  margin: 0.5rem auto;
}

.cycle-ring {
  position: absolute;
  inset: 0;
  overflow: visible;
}

.cycle-arc {
  fill: none;
  stroke: color-mix(in srgb, var(--cycle-color, var(--primary-400)) 60%, transparent);
  stroke-width: 2.5;
}

.cycle-arrowhead {
  fill: color-mix(in srgb, var(--cycle-color, var(--primary-400)) 80%, transparent);
}

.cycle-item {
  position: absolute;
  translate: -50% -50%;
  min-width: 5.5rem;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--_cyc, var(--cycle-color, var(--primary-400))) 20%, var(--bg-secondary));
  border: 1.5px solid var(--_cyc, var(--cycle-color, var(--primary-400)));
  color: var(--text-primary);
  font-weight: 700;
  font-size: 0.8rem;
  text-align: center;
  white-space: nowrap;
}

.cycle-center {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--cycle-color, var(--primary-400));
}
</style>
