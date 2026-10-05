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
}

.badge {
  /* default variant; others override */
  --badge-color: var(--primary-400, #c678dd);
}

.badge-blue    { --badge-color: var(--one-dark-blue, #61afef); }
.badge-green   { --badge-color: var(--one-dark-green, #98c379); }
.badge-red     { --badge-color: var(--one-dark-red, #e06c75); }
.badge-yellow  { --badge-color: var(--one-dark-yellow, #e5c07b); }
.badge-cyan    { --badge-color: var(--one-dark-cyan, #56b6c2); }

.badge {
  --tint: var(--badge-color);
}



/* Same treatment as <Kbd>: neutral fill with readable text */
.badge-gray {
  background: var(--key-bg, #4b5263);
  color: var(--text-bright, #e6e6e6);
}
</style>
