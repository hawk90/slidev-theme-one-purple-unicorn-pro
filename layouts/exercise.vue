<template>
  <!-- An exercise or lab: its number and time on top, the task (the slide's
       content) on the left, and on the right how to work and what to expect,
       with a countdown for the time (its start button: it waits for you).
       Frontmatter: exercise (the number or a label), time ("15min", 15),
       method, expected, countdown: false. -->
  <div class="slidev-layout exercise">
    <div class="exercise-tag">
      <span class="exercise-number">{{ label }}</span>
      <span v-if="minutes" class="exercise-time">⏱ {{ minutesText }}</span>
    </div>
    <div class="exercise-body">
      <div class="exercise-task">
        <slot />
      </div>
      <aside v-if="method || expected || showCountdown" class="exercise-side">
        <div v-if="method" class="exercise-box">
          <div class="exercise-box-title">How</div>
          <div v-html="richText(method)" />
        </div>
        <div v-if="expected" class="exercise-box exercise-expected">
          <div class="exercise-box-title">Expected</div>
          <div v-html="richText(expected)" />
        </div>
        <Countdown v-if="showCountdown" :minutes="minutes" :auto-start="false" size="sm" label="Time left" />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import Countdown from '../components/Countdown.vue'
import { durationSeconds } from '../utils/pace'
import { isOff } from '../utils/frontmatter'
import { richText } from '../utils/rich-text'

const { $frontmatter } = useSlideContext()
const fm = computed(() => ($frontmatter ?? {}) as Record<string, any>)

const label = computed(() => {
  const v = fm.value.exercise
  if (v === undefined || v === null || v === true || v === '') return 'Exercise'
  return /^\d+$/.test(String(v)) ? `Exercise ${v}` : String(v)
})
// time: "15min", "1h", 15 (minutes, as Countdown takes them)
const minutes = computed(() => {
  const t = fm.value.time
  if (t === undefined || t === null || t === '') return 0
  if (typeof t === 'number' || /^\d+(\.\d+)?$/.test(String(t))) return Number(t)
  return (durationSeconds(t) ?? 0) / 60
})
const minutesText = computed(() => (minutes.value >= 60 ? `${Math.round(minutes.value / 6) / 10} h` : `${Math.round(minutes.value)} min`))
const method = computed(() => String(fm.value.method ?? ''))
const expected = computed(() => String(fm.value.expected ?? ''))
const showCountdown = computed(() => minutes.value > 0 && !isOff(fm.value.countdown))
</script>

<style scoped>
/* Variables: --exercise-accent */
.exercise {
  --_ex: var(--exercise-accent, var(--one-dark-green));
}

/* Above the pinned title, at the top edge */
.exercise-tag {
  position: absolute;
  top: 0;
  right: var(--slide-padding-x, 30px);
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0 0 8px 8px;
  background: color-mix(in srgb, var(--_ex) 16%, transparent);
  border: 1px solid color-mix(in srgb, var(--_ex) 40%, transparent);
  border-top: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--_ex);
}

.exercise-time {
  font-weight: 500;
  opacity: 0.85;
}

.exercise-body {
  display: grid;
  grid-template-columns: 1fr minmax(13rem, 30%);
  gap: 2rem;
  align-items: start;
}

.exercise-side {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.exercise-box {
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--text-primary) 4%, transparent);
  border: 1px solid var(--border-default);
  font-size: 0.8rem;
  line-height: 1.45;
}

.exercise-expected {
  border-color: color-mix(in srgb, var(--_ex) 45%, transparent);
  background: color-mix(in srgb, var(--_ex) 8%, transparent);
}

.exercise-box-title {
  margin-bottom: 0.25rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.exercise-expected .exercise-box-title {
  color: var(--_ex);
}
</style>
