<template>
  <div class="grid-columns" :style="gridStyle">
    <template v-for="(_, i) in count" :key="i">
      <div v-if="divider && i > 0" class="grid-divider" />
      <div class="grid-col">
        <div
          v-if="labels[i]"
          class="grid-label tint-chip"
          :class="`grid-label-${i}`"
          :style="labelColors[i] ? { '--label-color': labelColors[i] } : undefined"
        >
          {{ labels[i] }}
        </div>
        <slot :name="slotNames[i]" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  count: { type: Number, default: 2 },
  widths: { type: Array as () => (string | number)[], default: () => [] },
  divider: { type: Boolean, default: false },
  labels: { type: Array as () => string[], default: () => [] },
  labelColors: { type: Array as () => string[], default: () => [] },
})

const slotNames = computed(() => {
  if (props.count === 2) return ['left', 'right']
  if (props.count === 3) return ['left', 'center', 'right']
  return Array.from({ length: props.count }, (_, i) => `col-${i}`)
})

const gridStyle = computed(() => {
  // A bare number is a share of the row (2 → 2fr); anything else is a CSS length
  const w = slotNames.value.map((_, i) => {
    const v = String(props.widths[i] ?? '').trim()
    return !v ? '1fr' : /^\d*\.?\d+$/.test(v) ? `${v}fr` : v
  })
  const cols = props.divider
    ? w.join(' 1px ')
    : w.join(' ')
  return { gridTemplateColumns: cols }
})
</script>

<style scoped>
.grid-columns {
  display: grid;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
}

.grid-divider {
  width: 1px;
  height: 100%;
  background: var(--border-default, rgba(171, 178, 191, 0.15));
}

.grid-col {
  overflow: auto;
}

.grid-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  width: fit-content;
  margin-bottom: 0.5rem;
  --tint: var(--label-color);
}

.grid-label-0 { --label-color: var(--one-dark-blue, #61afef); }
.grid-label-1 { --label-color: var(--one-dark-green, #98c379); }
.grid-label-2 { --label-color: var(--one-dark-magenta, #c678dd); }


</style>
