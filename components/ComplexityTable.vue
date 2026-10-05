<template>
  <div class="complexity-table">
    <div v-if="title" class="ct-title">{{ title }}</div>
    <table>
      <thead>
        <tr>
          <th v-for="c in columns" :key="c.key">{{ c.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in rows"
          :key="`row-${row.n}-${i}`"
          :class="{ 'ct-highlight': row.highlight }"
        >
          <td v-for="c in columns" :key="c.key" :class="`ct-${c.key}`" v-html="richText(row[c.key])" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
interface Row {
  n: string
  target: string
  algo: string
  complexity?: string
  highlight?: boolean
}

const DEFAULT_ROWS: Row[] = [
  { n: '$N \\le 10$', target: '$O(N!)$', algo: 'Brute Force / Permutation', complexity: '$O(N!)$' },
  { n: '$N \\le 20$', target: '$O(2^N)$', algo: 'Bitmask DP / Backtracking', complexity: '$O(2^N \\cdot N)$' },
  { n: '$N \\le 500$', target: '$O(N^3)$', algo: 'Floyd-Warshall / DP', complexity: '$O(N^3)$' },
  { n: '$N \\le 5{,}000$', target: '$O(N^2)$', algo: 'DP / Brute Force', complexity: '$O(N^2)$' },
  { n: '$N \\le 10^5$', target: '$O(N \\log N)$', algo: 'Sort / Segment Tree', complexity: '$O(N \\log N)$' },
  { n: '$N \\le 10^6$', target: '$O(N)$', algo: 'Greedy / Linear Scan', complexity: '$O(N)$' },
  { n: '$N \\le 10^{18}$', target: '$O(\\log N)$', algo: 'Binary Search / Math', complexity: '$O(\\log N)$' },
]
</script>

<script setup lang="ts">
import { computed } from 'vue'

// Cells accept $...$ (KaTeX) and x^y (superscript)
import { richText } from '../utils/rich-text'

const props = defineProps({
  title: { type: String, default: '' },
  rows: {
    type: Array as () => Row[],
    default: () => DEFAULT_ROWS,
  },
  showComplexity: { type: Boolean, default: true },
})

const COLUMNS = [
  { key: 'n', label: 'N' },
  { key: 'target', label: 'Target' },
  { key: 'algo', label: 'Algorithm' },
  { key: 'complexity', label: 'Complexity' },
] as const

const columns = computed(() =>
  props.showComplexity ? COLUMNS : COLUMNS.filter(c => c.key !== 'complexity')
)
</script>

<style scoped>
.complexity-table {
  margin: 0.75rem 0;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--border-default, rgba(255, 255, 255, 0.1));
  background: var(--bg-secondary, #1e2030);
}

.ct-title {
  font-weight: 700;
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  background: color-mix(in srgb, var(--primary-400) 10%, transparent);
  color: var(--primary-400, #c678dd);
  border-bottom: 1px solid var(--border-default, rgba(255, 255, 255, 0.06));
  letter-spacing: 0.02em;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
  margin: 0;
  box-shadow: none;
  background: transparent;
}

thead {
  background: var(--bg-tertiary, rgba(255, 255, 255, 0.03));
}

th {
  padding: 0.45rem 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-primary, #c0c6d0);
  border-bottom: 1px solid var(--border-default, rgba(255, 255, 255, 0.06));
}

td {
  padding: 0.4rem 0.75rem;
  border-top: 1px solid var(--border-default, rgba(255, 255, 255, 0.03));
  color: var(--text-secondary, #abb2bf);
}

tbody tr:hover {
  background: var(--bg-tertiary, rgba(255, 255, 255, 0.02));
}

.ct-highlight {
  background: color-mix(in srgb, var(--primary-400) 8%, transparent) !important;
}

.ct-highlight td {
  color: var(--text-primary, #dce0e8);
}

.complexity-table sup {
  font-size: 0.7em;
  line-height: 0;
}

.ct-n {
  font-family: var(--slidev-theme-font-mono, 'JetBrains Mono', monospace);
  font-weight: 600;
  --ct-color: var(--one-dark-cyan, #56b6c2);
  color: var(--ct-color);
  white-space: nowrap;
}

.ct-target {
  font-family: var(--slidev-theme-font-mono, 'JetBrains Mono', monospace);
  --ct-color: var(--one-dark-yellow, #e5c07b);
  color: var(--ct-color);
  white-space: nowrap;
}

.ct-algo {
  color: var(--text-primary, #dce0e8);
}

.ct-complexity {
  font-family: var(--slidev-theme-font-mono, 'JetBrains Mono', monospace);
  --ct-color: var(--one-dark-green, #98c379);
  color: var(--ct-color);
  white-space: nowrap;
}

/* Light mode: darker ink so the column colors stay readable on white */
html:not(.dark) .ct-n,
html:not(.dark) .ct-target,
html:not(.dark) .ct-complexity {
  color: color-mix(in srgb, var(--ct-color) 65%, black);
}
</style>
