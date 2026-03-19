<template>
  <div v-if="!isHidden" class="slide-indicator">
    {{ $nav.currentPage }} / {{ $nav.total }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const { currentLayout } = useNav()

const hiddenLayouts = ['cover', 'section', 'intro', 'end']

const isHidden = computed(() => hiddenLayouts.includes(currentLayout.value))
</script>

<style scoped>
.slide-indicator {
  position: fixed;
  right: 2rem;
  bottom: 1.5rem;
  font-family: var(--slidev-theme-font-mono, 'JetBrains Mono', monospace);
  font-size: 0.75rem;
  color: var(--text-muted, #5c6370);
  letter-spacing: 0.05em;
  opacity: 0.7;
  z-index: 10;
  pointer-events: none;
  transition: opacity var(--transition-fast, 150ms ease);
}
</style>
