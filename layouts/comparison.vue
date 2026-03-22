<template>
  <div class="slidev-layout comparison-layout">
    <div class="comp-header">
      <slot />
    </div>
    <div class="comp-columns">
      <div class="comp-left">
        <div class="comp-label comp-label-left">{{ leftLabel }}</div>
        <div class="comp-content">
          <slot name="left" />
        </div>
      </div>
      <div class="comp-divider" />
      <div class="comp-right">
        <div class="comp-label comp-label-right">{{ rightLabel }}</div>
        <div class="comp-content">
          <slot name="right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  leftLabel: { type: String, default: 'Before' },
  rightLabel: { type: String, default: 'After' },
})
</script>

<style scoped>
.comparison-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.comp-header {
  flex-shrink: 0;
}

.comp-columns {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0;
  flex: 1;
  min-height: 0;
}

.comp-left,
.comp-right {
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.comp-label {
  font-family: var(--slidev-theme-font-mono, 'JetBrains Mono', monospace);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  width: fit-content;
  margin-bottom: 0.75rem;
}

.comp-label-left {
  background: rgba(59, 130, 246, 0.15);
  color: var(--one-dark-blue, #61afef);
}

.comp-label-right {
  background: rgba(16, 185, 129, 0.15);
  color: var(--one-dark-green, #98c379);
}

.comp-content {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.comp-divider {
  width: 1px;
  background: var(--border-default, rgba(255, 255, 255, 0.1));
  margin: 0 1rem;
}
</style>
