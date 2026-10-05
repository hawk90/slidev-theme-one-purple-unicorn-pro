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

.badge {
  --badge-color: var(--primary-400, #c678dd);
}

.badge-default { --badge-color: var(--primary-400, #c678dd); }
.badge-blue    { --badge-color: var(--one-dark-blue, #61afef); }
.badge-green   { --badge-color: var(--one-dark-green, #98c379); }
.badge-red     { --badge-color: var(--one-dark-red, #e06c75); }
.badge-yellow  { --badge-color: var(--one-dark-yellow, #e5c07b); }
.badge-cyan    { --badge-color: var(--one-dark-cyan, #56b6c2); }

.badge:not(.badge-gray) {
  background: color-mix(in srgb, var(--badge-color) 15%, transparent);
  color: var(--badge-color);
}

/* Light mode: pastel text is too faint on a light tint; use a darker ink */
html:not(.dark) .badge:not(.badge-gray) {
  color: color-mix(in srgb, var(--badge-color) 65%, black);
}

/* Same treatment as <Kbd>: neutral fill with readable text */
.badge-gray {
  background: var(--bg-tertiary, #3e4452);
  color: var(--text-primary, #abb2bf);
}
</style>
