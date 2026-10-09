<template>
  <div v-if="remaining > 0 || showZero" class="countdown" :class="`countdown-${size}`">
    <span class="countdown-time">{{ formatted }}</span>
    <span v-if="label" class="countdown-label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { onSlideEnter } from '@slidev/client'

const props = defineProps({
  minutes: { type: Number, default: 5 },
  autoStart: { type: Boolean, default: true },
  label: { type: String, default: '' },
  size: { type: String, default: 'default' },
  showZero: { type: Boolean, default: true },
})

// Whole seconds, never negative (0.5 → 30 s; -1 → 0)
const total = () => Math.max(0, Math.round(Number(props.minutes) * 60) || 0)
const remaining = ref(total())
let timer: ReturnType<typeof setInterval> | null = null

const formatted = computed(() => {
  const m = Math.floor(remaining.value / 60)
  const s = remaining.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

function start() {
  if (timer) return
  timer = setInterval(() => {
    if (remaining.value > 0) remaining.value--
    else if (timer) { clearInterval(timer); timer = null }
  }, 1000)
}

function stop() {
  if (timer) { clearInterval(timer); timer = null }
}

// Start when the slide is first shown, not when it mounts: Slidev mounts
// every slide shortly after load, so a timer on slide 20 would already be
// running. Once started it keeps running, like a real timer.
let started = false
const autoStart = () => {
  if (started || !props.autoStart) return
  started = true
  start()
}
try {
  onSlideEnter(autoStart)
}
catch {
  // Outside a slide (a deck's global layer, nav controls): no slide to enter
  onMounted(autoStart)
}

watch(() => props.minutes, () => { remaining.value = total() })

onUnmounted(() => stop())

defineExpose({ start, stop, remaining })
</script>

<style scoped>
.countdown {
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  font-family: var(--font-mono);
}

.countdown-time {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  font-size: var(--countdown-size, 1.5rem);
  color: var(--countdown-color, var(--primary-400, #c678dd));
}

.countdown-label {
  font-size: 0.75em;
  color: var(--text-muted, #5c6370);
}

/* Sizes (presets for --countdown-size; any size works via the variable) */
.countdown-sm { --countdown-size: 1rem; }
.countdown-lg { --countdown-size: 3rem; }
.countdown-xl { --countdown-size: 5rem; }
</style>

<style>
/* Not in PDF/PNG exports or printouts (html.print-mode, utils/print-export.ts) */
.print-mode .countdown { display: none !important; }
</style>
