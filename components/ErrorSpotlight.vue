<template>
  <!-- A bug story in three panels: the error, its root cause, the fix (slots
       error / cause / fix, Markdown and code welcome) -->
  <div class="spotlight">
    <section v-for="p in panels" :key="p.slot" class="spot-panel" :class="`spot-${p.slot}`">
      <header class="spot-head"><span class="spot-icon" aria-hidden="true">{{ p.icon }}</span>{{ p.title }}</header>
      <div class="spot-body"><slot :name="p.slot" /></div>
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  errorTitle: { type: String, default: 'Error' },
  causeTitle: { type: String, default: 'Root cause' },
  fixTitle: { type: String, default: 'Fix' },
})

const panels = [
  { slot: 'error', icon: '✗', title: props.errorTitle },
  { slot: 'cause', icon: '?', title: props.causeTitle },
  { slot: 'fix', icon: '✓', title: props.fixTitle },
]
</script>

<style scoped>
.spotlight {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin: 0.75rem 0;
  text-align: left;
}

.spot-panel {
  --_c: var(--one-dark-red);
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in srgb, var(--_c) 40%, transparent);
  border-top: 3px solid var(--_c);
  background: color-mix(in srgb, var(--_c) 6%, transparent);
}
.spot-cause { --_c: var(--one-dark-yellow); }
.spot-fix { --_c: var(--one-dark-green); }

.spot-head {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.75rem 0.25rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--_c);
}

.spot-icon {
  display: grid;
  place-items: center;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  background: var(--_c);
  color: var(--bg-secondary);
  font-size: 0.7rem;
}

.spot-body {
  padding: 0.25rem 0.75rem 0.75rem;
  font-size: 0.8rem;
  min-width: 0;
}
.spot-body > :deep(:first-child) { margin-top: 0; }
.spot-body > :deep(:last-child) { margin-bottom: 0; }
</style>
