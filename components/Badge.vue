<template>
  <span class="badge" :class="`badge-${variant}`">
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

.badge-default {
  background: color-mix(in srgb, var(--primary-400) 15%, transparent);
  color: var(--primary-400, #c678dd);
}

.badge-blue {
  background: color-mix(in srgb, var(--one-dark-blue) 15%, transparent);
  color: var(--one-dark-blue, #61afef);
}

.badge-green {
  background: color-mix(in srgb, var(--one-dark-green) 15%, transparent);
  color: var(--one-dark-green, #98c379);
}

.badge-red {
  background: color-mix(in srgb, var(--one-dark-red) 15%, transparent);
  color: var(--one-dark-red, #e06c75);
}

.badge-yellow {
  background: color-mix(in srgb, var(--one-dark-yellow) 15%, transparent);
  color: var(--one-dark-yellow, #e5c07b);
}

.badge-cyan {
  background: color-mix(in srgb, var(--one-dark-cyan) 15%, transparent);
  color: var(--one-dark-cyan, #56b6c2);
}

/* Same treatment as <Kbd>: neutral fill with readable text */
.badge-gray {
  background: var(--bg-tertiary, #3e4452);
  color: var(--text-primary, #abb2bf);
}
</style>
