<template>
  <!-- Pros and cons side by side (a ✓ / ✗ list each) -->
  <div class="pros-cons">
    <section class="pc-col pc-pros">
      <header class="pc-head">✓ {{ prosTitle }}</header>
      <ul><li v-for="(p, i) in pros" :key="i" v-html="richText(p)" /></ul>
    </section>
    <section class="pc-col pc-cons">
      <header class="pc-head">✗ {{ consTitle }}</header>
      <ul><li v-for="(c, i) in cons" :key="i" v-html="richText(c)" /></ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { richText } from '../utils/rich-text'

defineProps({
  pros: { type: Array as () => string[], default: () => [] },
  cons: { type: Array as () => string[], default: () => [] },
  prosTitle: { type: String, default: 'Pros' },
  consTitle: { type: String, default: 'Cons' },
})
</script>

<style scoped>
.pros-cons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 0.75rem 0;
  text-align: left;
}

.pc-col {
  --_c: var(--one-dark-green);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-lg);
  border-top: 3px solid var(--_c);
  background: color-mix(in srgb, var(--_c) 7%, transparent);
}
.pc-cons { --_c: var(--one-dark-red); }

.pc-head {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--_c);
}

.pc-col ul {
  margin: 0.4rem 0 0;
  padding-left: 1.1rem;
}

.pc-col li {
  font-size: 0.85rem;
}

.pc-col li::marker {
  color: var(--_c);
}
</style>
