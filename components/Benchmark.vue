<template>
  <!-- Benchmark bars: one per result, the winner lit, each with its value and
       how it compares to the baseline (the first) -->
  <div class="benchmark">
    <div v-if="title" class="bm-title">{{ title }}</div>
    <div v-for="(r, i) in rows" :key="i" class="bm-row" :class="{ 'bm-winner': r.winner }">
      <span class="bm-label">{{ r.label }}</span>
      <div class="bm-track">
        <div class="bm-bar" :style="{ width: `${r.share * 100}%` }" />
      </div>
      <span class="bm-value num">{{ r.text }}</span>
      <span class="bm-ratio num">{{ r.ratio }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { benchmarkRows } from '../utils/benchmark'

const props = defineProps({
  /** [{ label, value }]: the first is the baseline */
  results: { type: Array as () => { label: string, value: number }[], required: true },
  unit: { type: String, default: '' },
  /** true: smaller wins (time, latency); false: bigger wins (throughput) */
  lowerIsBetter: { type: Boolean, default: true },
  title: { type: String, default: '' },
})

const rows = computed(() => benchmarkRows(props.results, props.lowerIsBetter, props.unit))
</script>

<style scoped>
/* Variables: --benchmark-color, --benchmark-winner */
.benchmark {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.75rem 0;
}

.bm-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.bm-row {
  display: grid;
  grid-template-columns: minmax(6rem, 22%) 1fr 6rem 4rem;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
}

.bm-label { color: var(--text-primary); font-weight: 600; }

.bm-track {
  height: 1.1rem;
  border-radius: 4px;
  background: color-mix(in srgb, var(--text-muted) 14%, transparent);
  overflow: hidden;
}

.bm-bar {
  height: 100%;
  border-radius: 4px;
  background: color-mix(in srgb, var(--benchmark-color, var(--text-muted)) 55%, transparent);
}

.bm-winner .bm-bar {
  background: var(--benchmark-winner, var(--gradient-primary));
  box-shadow: 0 0 10px color-mix(in srgb, var(--primary-400) 45%, transparent);
}

.bm-value { text-align: right; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-primary); }
.bm-ratio { text-align: right; font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-secondary); }
.bm-winner :is(.bm-label, .bm-ratio) { color: var(--one-dark-green); font-weight: 700; }
</style>
