<template>
  <!-- The theme's nav-bar buttons: the layout guide (shift+l; utils/authoring.ts)
       and high contrast (shift+h; utils/a11y.ts) -->
  <button
    type="button"
    class="slidev-icon-btn"
    :class="{ 'theme-nav-on': layoutGuide }"
    title="Layout guide (shift+l)"
    aria-label="Layout guide"
    :aria-pressed="layoutGuide"
    @click="toggleLayoutGuide"
  >
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M9 4v16M15 4v16M3 12h18" stroke-dasharray="2 2" />
    </svg>
  </button>
  <button
    type="button"
    class="slidev-icon-btn"
    :class="{ 'theme-nav-on': highContrast }"
    title="High contrast (shift+h)"
    aria-label="High contrast"
    :aria-pressed="highContrast"
    @click="toggleHighContrast"
  >
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { layoutGuide, toggleLayoutGuide } from './utils/authoring'
import { highContrast, toggleHighContrast } from './utils/a11y'
</script>

<style scoped>
.theme-nav-on { color: var(--primary-400, #a78bfa); }
</style>
