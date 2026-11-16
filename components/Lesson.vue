<template>
  <!-- The lesson learned: one takeaway, large, with the story behind it -->
  <div class="lesson">
    <div class="lesson-kicker">{{ kicker }}</div>
    <div class="lesson-title" v-html="richText(title)" />
    <div v-if="$slots.default" class="lesson-body"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { richText } from '../utils/rich-text'

defineProps({
  title: { type: String, required: true },
  kicker: { type: String, default: 'Lesson learned' },
})
</script>

<style scoped>
.lesson {
  position: relative;
  padding: 1.1rem 1.4rem 1.1rem 4rem;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary-400) 14%, transparent), color-mix(in srgb, var(--secondary-400) 10%, transparent));
  border: 1px solid color-mix(in srgb, var(--primary-400) 35%, transparent);
  text-align: left;
}

.lesson::before {
  content: '💡';
  position: absolute;
  left: 1.2rem;
  top: 1.05rem;
  font-size: 1.6rem;
}

.lesson-kicker {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary-400);
}

.lesson-title {
  margin-top: 0.15rem;
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.3;
  color: var(--text-primary);
}

.lesson-body {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}
.lesson-body > :deep(:first-child) { margin-top: 0; }
.lesson-body > :deep(:last-child) { margin-bottom: 0; }
</style>
