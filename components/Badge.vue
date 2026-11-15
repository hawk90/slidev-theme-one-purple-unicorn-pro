<template>
  <span class="badge" :class="[`badge-${variant}`, { 'tint-chip': variant !== 'gray' }]">
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps({
  variant: { type: String, default: 'default' },
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 1rem;
  letter-spacing: 0.02em;
  white-space: nowrap;
  vertical-align: middle;
  /* default variant; the others below override it */
  --badge-color: var(--primary-400);
  --tint: var(--badge-color);
}

/* The names of the color props (utils/colors.ts); default = primary */
.badge-primary { --badge-color: var(--primary-400); }
.badge-blue    { --badge-color: var(--one-dark-blue); }
.badge-green   { --badge-color: var(--one-dark-green); }
.badge-red     { --badge-color: var(--one-dark-red); }
.badge-yellow  { --badge-color: var(--one-dark-yellow); }
.badge-cyan    { --badge-color: var(--one-dark-cyan); }

/* Same treatment as <Kbd>: neutral fill with readable text */
.badge-gray {
  background: var(--key-bg);
  color: var(--text-bright);
}
</style>
