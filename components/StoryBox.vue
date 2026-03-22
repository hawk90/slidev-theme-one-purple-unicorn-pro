<template>
  <div class="story-box" :class="`story-${variant}`">
    <div class="story-header">
      <span class="story-icon">{{ iconMap[variant] || iconMap.history }}</span>
      <span class="story-title">{{ title }}</span>
      <span v-if="year" class="story-year">{{ year }}</span>
    </div>
    <div class="story-body">
      <slot />
    </div>
    <div v-if="source" class="story-source">
      &mdash; {{ source }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: 'History' },
  variant: { type: String, default: 'history' },
  year: { type: String, default: '' },
  source: { type: String, default: '' },
})

const iconMap: Record<string, string> = {
  history: '\u{1F4DC}',
  insight: '\u{1F4A1}',
  warning: '\u{26A0}\u{FE0F}',
  tip: '\u{2728}',
  person: '\u{1F464}',
}
</script>

<style scoped>
.story-box {
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  margin: 0.75rem 0;
  border-left: 3px solid;
  font-size: 0.8rem;
}

.story-history {
  background: rgba(198, 120, 221, 0.08);
  border-color: var(--one-dark-magenta, #c678dd);
}

.story-insight {
  background: rgba(229, 192, 123, 0.08);
  border-color: var(--one-dark-yellow, #e5c07b);
}

.story-warning {
  background: rgba(224, 108, 117, 0.08);
  border-color: var(--one-dark-red, #e06c75);
}

.story-tip {
  background: rgba(152, 195, 121, 0.08);
  border-color: var(--one-dark-green, #98c379);
}

.story-person {
  background: rgba(97, 175, 239, 0.08);
  border-color: var(--one-dark-blue, #61afef);
}

.story-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.4rem;
}

.story-icon {
  font-size: 0.9rem;
}

.story-title {
  font-weight: 700;
  font-size: 0.8rem;
  color: var(--text-primary, #dce0e8);
}

.story-year {
  font-family: var(--slidev-theme-font-mono, 'JetBrains Mono', monospace);
  font-size: 0.65rem;
  color: var(--text-muted, #5c6370);
  background: var(--bg-tertiary, rgba(255, 255, 255, 0.06));
  padding: 0.1rem 0.4rem;
  border-radius: 0.25rem;
  margin-left: auto;
}

.story-body {
  color: var(--text-secondary, #abb2bf);
  line-height: 1.5;
}

.story-body :deep(p) {
  margin: 0.2rem 0;
  font-size: 0.8rem;
}

.story-body :deep(strong) {
  color: var(--text-primary, #dce0e8);
}

.story-source {
  font-size: 0.7rem;
  color: var(--text-muted, #5c6370);
  font-style: italic;
  margin-top: 0.4rem;
}
</style>
