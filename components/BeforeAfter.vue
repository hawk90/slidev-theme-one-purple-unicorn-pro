<template>
  <!-- Before and after, side by side with an arrow between (slots before /
       after: code blocks, images, text); `delta` sums up the change -->
  <div class="before-after">
    <section class="ba-side ba-before">
      <header class="ba-label">{{ beforeLabel }}</header>
      <slot name="before" />
    </section>
    <div class="ba-arrow" aria-hidden="true">
      <span>→</span>
      <span v-if="delta" class="ba-delta">{{ delta }}</span>
    </div>
    <section class="ba-side ba-after">
      <header class="ba-label">{{ afterLabel }}</header>
      <slot name="after" />
    </section>
  </div>
</template>

<script setup lang="ts">
defineProps({
  beforeLabel: { type: String, default: 'Before' },
  afterLabel: { type: String, default: 'After' },
  /** Shown under the arrow, e.g. "4× faster" */
  delta: { type: String, default: '' },
})
</script>

<style scoped>
.before-after {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.75rem;
  margin: 0.75rem 0;
}

.ba-side { min-width: 0; }
.ba-side > :deep(.slidev-code-wrapper) { margin: 0.25rem 0 0; }

.ba-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.ba-before .ba-label { color: var(--one-dark-red); }
.ba-after .ba-label { color: var(--one-dark-green); }

.ba-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  font-size: 1.6rem;
  color: var(--primary-400);
}

.ba-delta {
  max-width: 6rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-align: center;
  color: var(--one-dark-green);
}
</style>
