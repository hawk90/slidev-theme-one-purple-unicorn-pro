<template>
  <div class="pattern-card">
    <template v-for="s in list" :key="s.key">
      <div
        v-if="textOf(s) || slots[s.key]"
        class="pattern-section"
        :class="`pattern-${s.key}`"
        :style="s.color ? { '--pattern-color': s.color } : undefined"
      >
        <div class="pattern-icon">{{ s.icon }}</div>
        <div class="pattern-label">{{ s.label }}</div>
        <div class="pattern-body">
          <slot :name="s.key"><span v-html="richText(textOf(s))" /></slot>
        </div>
      </div>
    </template>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { richText } from '../utils/rich-text'

interface Section {
  key: string
  label: string
  icon?: string
  color?: string
  text?: string
}

const props = defineProps({
  signal: { type: String, default: '' },
  template: { type: String, default: '' },
  alternatives: { type: String, default: '' },
  // Replace the default sections: [{ key, label, icon?, color?, text? }].
  // Content comes from the same-named slot, else `text`, else the same-named prop.
  sections: { type: Array as () => Section[], default: null },
})

const slots = useSlots()

const SECTIONS: Section[] = [
  { key: 'signal', icon: '\u{1F6A8}', label: 'Signal' },
  { key: 'template', icon: '\u{1F4DD}', label: 'Template' },
  { key: 'alternatives', icon: '\u{1F500}', label: 'Alternatives' },
]

const list = computed(() => props.sections ?? SECTIONS)

const textOf = (s: Section) => s.text ?? (props as Record<string, unknown>)[s.key] as string ?? ''
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

/* Default accent for custom sections; the built-in ones override it */
.pattern-section { --pattern-color: var(--primary-400, #c678dd); }
.pattern-signal { --pattern-color: var(--one-dark-red, #e06c75); }
.pattern-template { --pattern-color: var(--one-dark-blue, #61afef); }
.pattern-alternatives { --pattern-color: var(--one-dark-yellow, #e5c07b); }

.pattern-icon {
  font-size: 0.85rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.pattern-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  min-width: 5.5rem;
  flex-shrink: 0;
  margin-top: 0.15rem;
  color: color-mix(in srgb, var(--pattern-color) var(--ink-depth, 100%), black);
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
