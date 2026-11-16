<template>
  <!-- A radar (spider) chart in SVG: one polygon per series over the axes -->
  <figure class="radar">
    <svg viewBox="-150 -130 300 260" class="radar-svg" role="img" :aria-label="title || 'Radar chart'">
      <g class="radar-grid">
        <polygon v-for="k in rings" :key="k" :points="attr(axes.map(() => (k / rings) * top))" />
        <line v-for="(p, i) in pts(axes.map(() => top))" :key="i" x1="0" y1="0" :x2="p[0]" :y2="p[1]" />
      </g>
      <text
        v-for="(a, i) in axes"
        :key="a"
        class="radar-axis"
        :x="label(i)[0]"
        :y="label(i)[1]"
        :text-anchor="Math.abs(label(i)[0]) < 5 ? 'middle' : label(i)[0] > 0 ? 'start' : 'end'"
        dy="0.32em"
      >{{ a }}</text>
      <g v-for="(s, si) in series" :key="si" :style="{ '--_c': color(s, si) }">
        <polygon class="radar-area" :points="attr(s.values)" />
        <circle v-for="(p, i) in pts(s.values)" :key="i" :cx="p[0]" :cy="p[1]" r="3" class="radar-dot" />
      </g>
    </svg>
    <div v-if="series.length > 1 || series[0]?.name" class="chart-legend">
      <span v-for="(s, si) in series" :key="si" class="chart-key" :style="{ '--_c': color(s, si) }">{{ s.name }}</span>
    </div>
  </figure>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { colorValue } from '../utils/colors'
import { radarPoints, SERIES_COLORS, toSeries } from '../utils/chart'

const props = defineProps({
  axes: { type: Array as () => string[], required: true },
  /** Numbers (one series), or [{ name, values, color }] */
  data: { type: Array, required: true },
  /** The outer ring's value (the largest value by default) */
  max: { type: Number, default: undefined },
  title: { type: String, default: '' },
})

const R = 100
const rings = 4
const series = computed(() => toSeries(props.data))
const top = computed(() => props.max ?? Math.max(1, ...series.value.flatMap(s => s.values)))
const pts = (values: number[]) => radarPoints(values, top.value, R)
const attr = (values: number[]) => pts(values).map(p => p.join(',')).join(' ')
const label = (i: number) => radarPoints(props.axes.map((_, j) => (j === i ? top.value : 0)), top.value, R + 14)[i]
const color = (s: { color?: string }, i: number) => (s.color ? colorValue(s.color) : undefined) ?? SERIES_COLORS[i % SERIES_COLORS.length]
</script>

<style scoped>
.radar { margin: 0.5rem 0; width: 100%; }
.radar-svg { display: block; width: 100%; height: auto; max-height: var(--radar-height, 17rem); overflow: visible; }
.radar-grid polygon,
.radar-grid line { fill: none; stroke: color-mix(in srgb, var(--text-muted) 28%, transparent); stroke-width: 1; }
.radar-axis { fill: var(--text-secondary); font-size: 10px; }
.radar-area { fill: color-mix(in srgb, var(--_c) 22%, transparent); stroke: var(--_c); stroke-width: 2; stroke-linejoin: round; }
.radar-dot { fill: var(--_c); }

.chart-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.25rem 1rem; font-size: 0.75rem; color: var(--text-secondary); }
.chart-key::before { content: ''; display: inline-block; width: 0.7rem; height: 0.7rem; margin-right: 0.35rem; border-radius: 2px; background: var(--_c); vertical-align: -0.05rem; }
</style>
