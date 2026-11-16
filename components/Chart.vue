<template>
  <!-- A bar or line chart, drawn in SVG (no chart library): one or several
       series over `labels`, in the theme's colors; it grows in once the slide
       has arrived (exports show it drawn) -->
  <figure ref="root" class="chart" :class="{ 'chart-growing': growing }">
    <figcaption v-if="title" class="chart-title">{{ title }}</figcaption>
    <svg :viewBox="`0 0 ${W} ${H}`" class="chart-svg" role="img" :aria-label="title || 'Chart'">
      <!-- grid and axis labels -->
      <g class="chart-grid">
        <template v-for="t in ticks" :key="t">
          <line :x1="PAD_L" :x2="W - PAD_R" :y1="y(t)" :y2="y(t)" />
          <text :x="PAD_L - 6" :y="y(t)" dy="0.32em" text-anchor="end">{{ shortNumber(t) }}{{ t === scale.top ? unitSuffix : '' }}</text>
        </template>
      </g>
      <g class="chart-labels">
        <text v-for="(l, i) in labels" :key="l + i" :x="cx(i)" :y="H - 6" text-anchor="middle">{{ l }}</text>
      </g>
      <!-- bars: the series side by side in each slot -->
      <template v-if="type === 'bar'">
        <g v-for="(s, si) in series" :key="si" :style="{ '--_c': color(s, si) }">
          <rect
            v-for="(v, i) in s.values"
            :key="i"
            class="chart-bar"
            :x="cx(i) - slot / 2 + slot * 0.12 + si * barW"
            :y="y(v)"
            :width="Math.max(1, barW - 2)"
            :height="Math.max(0, y(0) - y(v))"
            :style="{ transitionDelay: `${i * 60}ms` }"
          >
            <title>{{ s.name ? `${s.name}: ` : '' }}{{ labels[i] }} {{ v }}{{ unitSuffix }}</title>
          </rect>
        </g>
      </template>
      <!-- lines -->
      <template v-else>
        <g v-for="(s, si) in series" :key="si" :style="{ '--_c': color(s, si) }">
          <polyline class="chart-line" :points="s.values.map((v, i) => `${cx(i)},${y(v)}`).join(' ')" pathLength="1" />
          <circle v-for="(v, i) in s.values" :key="i" class="chart-dot" :cx="cx(i)" :cy="y(v)" r="3.5">
            <title>{{ s.name ? `${s.name}: ` : '' }}{{ labels[i] }} {{ v }}{{ unitSuffix }}</title>
          </circle>
        </g>
      </template>
    </svg>
    <div v-if="series.length > 1 || series[0]?.name" class="chart-legend">
      <span v-for="(s, si) in series" :key="si" class="chart-key" :style="{ '--_c': color(s, si) }">{{ s.name }}</span>
    </div>
  </figure>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { colorValue } from '../utils/colors'
import { niceScale, SERIES_COLORS, shortNumber, toSeries } from '../utils/chart'
import { onSlideArrival } from '../utils/slide-motion'

const props = defineProps({
  /** bar (default) | line */
  type: { type: String, default: 'bar' },
  /** Numbers (one series), or [{ name, values, color }] */
  data: { type: Array, required: true },
  labels: { type: Array as () => string[], default: () => [] },
  title: { type: String, default: '' },
  unit: { type: String, default: '' },
  /** The top of the axis; by default a round number above the largest value */
  max: { type: Number, default: undefined },
})

const W = 600
const H = 300
const PAD_L = 48
const PAD_R = 12
const PAD_T = 12
const PAD_B = 26

const series = computed(() => toSeries(props.data))
const count = computed(() => Math.max(props.labels.length, ...series.value.map(s => s.values.length), 1))
const scale = computed(() => niceScale(props.max ?? Math.max(0, ...series.value.flatMap(s => s.values))))
const ticks = computed(() => Array.from({ length: Math.round(scale.value.top / scale.value.step) + 1 }, (_, i) => i * scale.value.step))
const slot = computed(() => (W - PAD_L - PAD_R) / count.value)
const barW = computed(() => (slot.value * 0.76) / Math.max(1, series.value.length))
const cx = (i: number) => PAD_L + slot.value * (i + 0.5)
const y = (v: number) => PAD_T + (1 - Math.max(0, Math.min(1, v / scale.value.top))) * (H - PAD_T - PAD_B)
const color = (s: { color?: string }, i: number) => (s.color ? colorValue(s.color) : undefined) ?? SERIES_COLORS[i % SERIES_COLORS.length]
const unitSuffix = computed(() => (props.unit ? ` ${props.unit}` : ''))

const root = ref<HTMLElement>()
const growing = ref(false)
onSlideArrival(root, () => { growing.value = true }, () => requestAnimationFrame(() => { growing.value = false }))
</script>

<style scoped>
.chart {
  margin: 0.75rem 0;
  width: 100%;
}

.chart-title {
  margin-bottom: 0.25rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.chart-svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
  font-family: var(--font-mono);
}

.chart-grid line { stroke: color-mix(in srgb, var(--text-muted) 25%, transparent); stroke-width: 1; }
.chart-grid text,
.chart-labels text { fill: var(--text-secondary); font-size: 11px; }

.chart-bar {
  fill: var(--_c);
  rx: 3px;
  transform-box: fill-box;
  transform-origin: bottom;
  transition: scale var(--motion-slow, 1.2s) var(--motion-ease, ease);
}
.chart-growing .chart-bar { scale: 1 0; transition: none; }

.chart-line {
  fill: none;
  stroke: var(--_c);
  stroke-width: 2.5;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset var(--motion-slow, 1.2s) var(--motion-ease, ease);
}
.chart-growing .chart-line { stroke-dashoffset: 1; transition: none; }

.chart-dot { fill: var(--_c); stroke: var(--slide-bg, var(--dark-bg)); stroke-width: 1.5; }

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  margin-top: 0.4rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.chart-key::before {
  content: '';
  display: inline-block;
  width: 0.7rem;
  height: 0.7rem;
  margin-right: 0.35rem;
  border-radius: 2px;
  background: var(--_c);
  vertical-align: -0.05rem;
}
</style>
