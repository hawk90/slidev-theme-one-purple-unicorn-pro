<template>
  <!-- The theme's nav-bar button: the layout guide (shift+l; utils/authoring.ts) -->
  <button
    type="button"
    class="slidev-icon-btn"
    :class="{ 'theme-nav-on': layoutGuide }"
    title="Layout guide (shift+l)"
    aria-label="Layout guide"
    @click="toggleLayoutGuide"
  >
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M9 4v16M15 4v16M3 12h18" stroke-dasharray="2 2" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { layoutGuide, toggleLayoutGuide } from './utils/authoring'
</script>

<style scoped>
.theme-nav-on { color: var(--primary-400, #a78bfa); }
</style>
