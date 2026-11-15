<template>
  <div
    ref="root"
    class="stat"
    :class="[plain ? 'stat-plain' : 'card', `stat-${size}`]"
    :style="{ '--stat-color': colorValue(color) }"
  >
    <div class="stat-value num" :aria-label="String(value)">{{ shown }}</div>
    <div v-if="label" class="stat-label">{{ label }}</div>
    <div v-if="delta" class="stat-delta" :class="`stat-${trend.tone}`">
      <span aria-hidden="true">{{ trend.arrow }}</span> {{ delta }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { colorValue } from '../utils/colors'
import { durationMs, formatNumber, parseNumber } from '../utils/number'
import { onSlideArrival } from '../utils/slide-motion'

const props = defineProps({
  // The figure as written: "$4.2M", "98.5%", "1,024", 42
  value: { type: [String, Number], required: true },
  label: { type: String, default: '' },
  // The change, as written: "+12%", "-3.1 pts"; its sign picks the arrow
  delta: { type: String, default: '' },
  // Which way is good for the delta: up (default) or down (latency, cost)
  good: { type: String as () => 'up' | 'down', default: 'up' },
  // Count up from 0 when the slide arrives (exports show the figure)
  count: { type: Boolean, default: false },
  // primary (default), blue, cyan, green, yellow, red, gray, or a CSS color
  color: { type: String, default: 'primary' },
  // sm | default | lg
  size: { type: String, default: 'default' },
  // No card around it
  plain: { type: Boolean, default: false },
})

const root = ref<HTMLElement>()
const parsed = computed(() => parseNumber(props.value))
const current = ref<number | null>(null) // null: the figure as written

const shown = computed(() => current.value === null || !parsed.value
  ? String(props.value)
  : formatNumber(current.value, parsed.value))

// The delta's direction from its sign: +12% up, -3% down, 0 / ±0 flat
const trend = computed(() => {
  const d = props.delta.trim()
  const n = parseNumber(d.replace(/^[−–]/, '-'))
  const down = /^[-−–▼↓]/.test(d) || (n !== null && n.value < 0)
  const flat = n !== null && n.value === 0
  const dir = flat ? 'flat' : down ? 'down' : 'up'
  return {
    arrow: dir === 'flat' ? '→' : dir === 'down' ? '▼' : '▲',
    tone: dir === 'flat' ? 'flat' : dir === props.good ? 'good' : 'bad',
  }
})

// Count-up (#57): from 0 to the figure, eased out, --stat-count-duration
// (--motion-slow, 1.2s)
let frame = 0
if (props.count) {
  onSlideArrival(root, () => {
    cancelAnimationFrame(frame)
    if (parsed.value) current.value = 0
  }, () => {
    const target = parsed.value
    if (!target || !root.value) { current.value = null; return }
    const ms = durationMs(getComputedStyle(root.value).getPropertyValue('--_stat-count-duration'), 1200)
    const t0 = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / ms)
      current.value = target.value * (1 - (1 - t) ** 3)
      if (t < 1) frame = requestAnimationFrame(step)
      else current.value = null
    }
    frame = requestAnimationFrame(step)
  })
}
onUnmounted(() => cancelAnimationFrame(frame))
</script>

<style scoped>
/* Variables: --stat-size, --stat-color (or `color`), --stat-count-duration */
.stat {
  --_stat-count-duration: var(--stat-count-duration, var(--motion-slow, 1.2s));
  --card-margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.stat-sm { --card-padding: 0.9rem 1.1rem; --_stat-size: 1.5rem; }
.stat-default { --card-padding: 1.2rem 1.4rem; --_stat-size: 2.25rem; }
.stat-lg { --card-padding: 1.5rem 1.75rem; --_stat-size: 3.25rem; }

.stat-value {
  font-size: var(--stat-size, var(--_stat-size));
  font-weight: 700;
  line-height: 1.1;
  color: var(--stat-color, var(--primary-400));
  white-space: nowrap;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary); /* muted is 3.8:1 on the dark card */
}

.stat-delta {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
}

.stat-good { color: var(--one-dark-green); }
.stat-bad { color: var(--one-dark-red); }
.stat-flat { color: var(--text-secondary); }
</style>
