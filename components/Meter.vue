<template>
  <!-- A meter: a labelled bar filled to value / max. With `animate` it fills
       once the slide has arrived (exports show it full). Thresholds can
       recolor it: `warn` / `danger` (as values) turn it yellow / red. -->
  <div ref="root" class="meter" :class="[`meter-${size}`, { 'meter-filling': filling }]" :style="style" role="meter" :aria-valuenow="num" :aria-valuemin="0" :aria-valuemax="maxNum" :aria-label="label || undefined">
    <div v-if="label || showValue" class="meter-head">
      <span v-if="label" class="meter-label">{{ label }}</span>
      <span v-if="showValue" class="meter-value num">{{ shown }}</span>
    </div>
    <div class="meter-track">
      <div class="meter-fill" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { colorValue } from '../utils/colors'
import { onSlideArrival } from '../utils/slide-motion'

const props = defineProps({
  value: { type: [Number, String], required: true },
  max: { type: [Number, String], default: 100 },
  label: { type: String, default: '' },
  /** The number at the right: true shows "value / max" as a percent; a string is shown as is */
  showValue: { type: [Boolean, String], default: true },
  /** A unit after the percent-less value, e.g. "GB/s" (then value / max is shown) */
  unit: { type: String, default: '' },
  color: { type: String, default: 'primary' },
  /** Values from which the bar turns yellow / red (higher is worse) */
  warn: { type: [Number, String], default: undefined },
  danger: { type: [Number, String], default: undefined },
  /** sm | md (default) | lg */
  size: { type: String, default: 'md' },
  animate: { type: Boolean, default: false },
})

const num = computed(() => Number.parseFloat(String(props.value)) || 0)
const maxNum = computed(() => Number.parseFloat(String(props.max)) || 100)
const ratio = computed(() => Math.min(1, Math.max(0, num.value / maxNum.value)))
const shown = computed(() => {
  if (typeof props.showValue === 'string') return props.showValue
  if (props.unit) return `${num.value} / ${maxNum.value} ${props.unit}`
  return `${Math.round(ratio.value * 100)}%`
})
const color = computed(() => {
  const at = (v: unknown) => v !== undefined && v !== '' && num.value >= Number(v)
  if (at(props.danger)) return colorValue('red')
  if (at(props.warn)) return colorValue('yellow')
  return colorValue(props.color) ?? props.color
})
const filling = ref(false)
const style = computed(() => ({ '--_meter': color.value, '--_meter-ratio': filling.value ? 0 : ratio.value }))

const root = ref<HTMLElement>()
if (props.animate) {
  onSlideArrival(root, () => { filling.value = true }, () => {
    requestAnimationFrame(() => { filling.value = false })
  })
}
</script>

<style scoped>
/* Variables: --meter-height, --meter-track */
.meter {
  --_h: var(--meter-height, 0.55rem);
  width: 100%;
  margin: 0.4rem 0;
  text-align: left;
}
.meter-sm { --_h: var(--meter-height, 0.35rem); }
.meter-lg { --_h: var(--meter-height, 0.9rem); }

.meter-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
}
.meter-label { color: var(--text-secondary); }
.meter-value { color: var(--text-primary); font-weight: 600; font-family: var(--font-mono); font-size: 0.75rem; }

.meter-track {
  height: var(--_h);
  border-radius: 999px;
  background: var(--meter-track, color-mix(in srgb, var(--text-muted) 22%, transparent));
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  width: calc(var(--_meter-ratio) * 100%);
  border-radius: inherit;
  background: linear-gradient(90deg, color-mix(in srgb, var(--_meter) 70%, transparent), var(--_meter));
  box-shadow: 0 0 8px color-mix(in srgb, var(--_meter) 45%, transparent);
  transition: width var(--motion-slow, 1.2s) var(--motion-ease, ease);
}
.meter-filling .meter-fill { transition: none; }
</style>
