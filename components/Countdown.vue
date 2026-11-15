<template>
  <div
    v-if="remaining > 0 || showZero"
    class="countdown"
    :class="[sized.class, `countdown-${state}`]"
    :style="sized.style"
    role="timer"
    :title="hint"
    @click.stop="toggle"
    @dblclick.stop="reset"
  >
    <!-- autoStart: false, before the first start. mousedown.prevent: the
         button doesn't keep focus, or Space (next slide) would press it -->
    <button
      v-if="state === 'idle' && !waitingToAutoStart"
      type="button"
      class="countdown-start"
      aria-label="Start"
      @mousedown.prevent
      @click.stop="start"
    >
      ▶
    </button>
    <span class="countdown-time">{{ formatted }}</span>
    <span v-if="label" class="countdown-label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { onSlideEnter } from '@slidev/client'
import { sizeAttrs } from '../utils/size'

const props = defineProps({
  minutes: { type: Number, default: 5 },
  // false: a start button; the timer starts on click
  autoStart: { type: Boolean, default: true },
  label: { type: String, default: '' },
  // sm | default | lg | xl, or any CSS length (e.g. "2.5rem"), as QRCode
  size: { type: String, default: 'default' },
  showZero: { type: Boolean, default: true },
})

// Whole seconds, never negative (0.5 → 30 s; -1 → 0)
const total = () => Math.max(0, Math.round(Number(props.minutes) * 60) || 0)
const remaining = ref(total())
const sized = computed(() => sizeAttrs('countdown', props.size, '--countdown-size'))
let timer: ReturnType<typeof setInterval> | null = null

// idle: not started yet · running · paused · done: reached 0
const state = ref<'idle' | 'running' | 'paused' | 'done'>('idle')
const hint = computed(() => state.value === 'idle'
  ? 'Click to start'
  : 'Click: pause / resume · Double-click: reset')

const formatted = computed(() => {
  const m = Math.floor(remaining.value / 60)
  const s = remaining.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

function stop() {
  if (timer) { clearInterval(timer); timer = null }
}

function start() {
  if (timer) return
  started.value = true
  if (remaining.value <= 0) { state.value = 'done'; return }
  state.value = 'running'
  timer = setInterval(() => {
    if (remaining.value > 0) remaining.value--
    if (remaining.value <= 0) { stop(); state.value = 'done' }
  }, 1000)
}

function pause() {
  if (state.value !== 'running') return
  stop()
  state.value = 'paused'
}

// Click on the timer: start, pause or resume (not at 0: double-click resets)
function toggle() {
  if (state.value === 'running') pause()
  else if (state.value !== 'done') start()
}

// Double-click: back to the full time, stopped (its two clicks toggled twice
// before it, so the state is as it was)
function reset() {
  stop()
  remaining.value = total()
  state.value = 'idle'
}

// Start when the slide is first shown, not when it mounts: Slidev mounts
// every slide shortly after load, so a timer on slide 20 would already be
// running. Once started it keeps running, like a real timer.
const started = ref(false)
// Before its slide is first shown, an auto-starting timer shows no button
const waitingToAutoStart = computed(() => props.autoStart && !started.value)
const autoStart = () => {
  if (!started.value && props.autoStart) start()
}
try {
  onSlideEnter(autoStart)
}
catch {
  // Outside a slide (a deck's global layer, nav controls): no slide to enter
  onMounted(autoStart)
}

watch(() => props.minutes, reset)

onUnmounted(() => stop())

defineExpose({ start, stop: pause, pause, reset, remaining })
</script>

<style scoped>
.countdown {
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  font-family: var(--font-mono);
  cursor: pointer;
  user-select: none;
}

.countdown-time {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  font-size: var(--countdown-size, 1.5rem);
  color: var(--countdown-color, var(--primary-400));
  transition: opacity var(--transition-fast);
}

/* Paused, or not started: the time dims */
.countdown-paused .countdown-time,
.countdown-idle .countdown-time {
  opacity: 0.55;
}

.countdown-paused .countdown-time {
  animation: countdown-blink 1.2s steps(1) infinite;
}

@keyframes countdown-blink {
  50% { opacity: 0.25; }
}

.countdown-start {
  align-self: center;
  display: inline-grid;
  place-items: center;
  width: calc(var(--countdown-size, 1.5rem) * 0.9);
  height: calc(var(--countdown-size, 1.5rem) * 0.9);
  padding: 0 0 0 0.12em;
  border: 1px solid color-mix(in srgb, var(--countdown-color, var(--primary-400)) 50%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--countdown-color, var(--primary-400)) 12%, transparent);
  color: var(--countdown-color, var(--primary-400));
  font-size: calc(var(--countdown-size, 1.5rem) * 0.4);
  line-height: 1;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.countdown-start:hover {
  background: color-mix(in srgb, var(--countdown-color, var(--primary-400)) 24%, transparent);
}

.countdown-label {
  font-size: 0.75em;
  color: var(--text-muted);
}

/* Sizes (presets for --countdown-size; any size works via the variable) */
.countdown-sm { --countdown-size: 1rem; }
.countdown-lg { --countdown-size: 3rem; }
.countdown-xl { --countdown-size: 5rem; }

@media (prefers-reduced-motion: reduce) {
  .countdown-paused .countdown-time { animation: none; }
}

/* Not in PDF/PNG exports or printouts (html.print-mode, utils/print-mode.ts) */
.print-mode .countdown {
  display: none;
}
</style>
