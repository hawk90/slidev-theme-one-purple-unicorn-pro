<template>
  <div class="story-box" :class="`story-${variant}`" :style="color ? { '--story-color': color } : undefined">
    <div class="story-header">
      <span class="story-icon">{{ icon || iconMap[variant] || iconMap.history }}</span>
      <span class="story-title" v-html="richText(title)" />
      <span v-if="year" class="story-year tint-chip">{{ year }}</span>
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
import { richText } from '../utils/rich-text'

defineProps({
  title: { type: String, default: 'History' },
  variant: { type: String, default: 'history' },
  year: { type: String, default: '' },
  source: { type: String, default: '' },
  // Custom accent color / icon; override the variant's
  color: { type: String, default: '' },
  icon: { type: String, default: '' },
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
  border-radius: var(--story-radius, 0.75rem);
  padding: var(--story-padding, 0.75rem 1rem);
  margin: 0.75rem 0;
  border-left: 3px solid var(--story-color);
  background: color-mix(in srgb, var(--story-color) 8%, transparent);
  font-size: 0.8rem;
}

.story-history { --story-color: var(--one-dark-magenta, #c678dd); }
.story-insight { --story-color: var(--one-dark-yellow, #e5c07b); }
.story-warning { --story-color: var(--one-dark-red, #e06c75); }
.story-tip { --story-color: var(--one-dark-green, #98c379); }
.story-person { --story-color: var(--one-dark-blue, #61afef); }

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
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  --tint: var(--story-color);
  padding: 0.1rem 0.5rem;
  border-radius: 1rem;
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
  color: var(--text-secondary, #939aa3);
  font-style: italic;
  margin-top: 0.4rem;
}
</style>
