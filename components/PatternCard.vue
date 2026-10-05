<template>
  <div class="pattern-card">
    <template v-for="s in SECTIONS" :key="s.key">
      <div v-if="props[s.key] || slots[s.key]" class="pattern-section" :class="`pattern-${s.key}`">
        <div class="pattern-icon">{{ s.icon }}</div>
        <div class="pattern-label">{{ s.label }}</div>
        <div class="pattern-body">
          <slot :name="s.key">{{ props[s.key] }}</slot>
        </div>
      </div>
    </template>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'

const props = defineProps({
  signal: { type: String, default: '' },
  template: { type: String, default: '' },
  alternatives: { type: String, default: '' },
})

const slots = useSlots()

// Each section is shown when its prop (plain text) or same-named slot (rich content) is given
const SECTIONS = [
  { key: 'signal', icon: '\u{1F6A8}', label: 'Signal' },
  { key: 'template', icon: '\u{1F4DD}', label: 'Template' },
  { key: 'alternatives', icon: '\u{1F500}', label: 'Alternatives' },
] as const
</script>

<style scoped>
.pattern-card {
  border: 1px solid var(--border-default, rgba(255, 255, 255, 0.1));
  border-radius: 0.75rem;
  overflow: hidden;
  margin: 0.75rem 0;
  background: var(--bg-secondary, #1e2030);
}

.pattern-section {
  padding: 0.6rem 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border-default, rgba(255, 255, 255, 0.06));
  background: color-mix(in srgb, var(--pattern-color) 6%, transparent);
}

.pattern-section:last-of-type {
  border-bottom: none;
}

.pattern-signal { --pattern-color: var(--one-dark-red, #e06c75); }
.pattern-template { --pattern-color: var(--one-dark-blue, #61afef); }
.pattern-alternatives { --pattern-color: var(--one-dark-yellow, #e5c07b); }

.pattern-icon {
  font-size: 0.85rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.pattern-label {
  font-family: var(--slidev-theme-font-mono, 'JetBrains Mono', monospace);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  min-width: 5.5rem;
  flex-shrink: 0;
  margin-top: 0.15rem;
  color: var(--pattern-color);
}

.pattern-body {
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--text-primary, #abb2bf);
}

.pattern-body :deep(code) {
  font-size: 0.75rem;
}
</style>
