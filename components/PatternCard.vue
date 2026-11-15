<template>
  <div class="pattern-card box-shell">
    <template v-for="(s, i) in shown" :key="s.key">
      <div
        class="pattern-section"
        :class="[`pattern-${s.key}`, { 'pattern-last': i === shown.length - 1 }]"
        :style="s.color ? { '--pattern-color': colorValue(s.color) } : undefined"
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
import { colorValue } from '../utils/colors'

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
// Sections with content; the last one has no bottom rule
const shown = computed(() => list.value.filter(s => textOf(s) || slots[s.key]))
</script>

<style scoped>
.pattern-section {
  padding: 0.6rem 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--pattern-color) 6%, transparent);
}

.pattern-last {
  border-bottom: none;
}

/* Default accent for custom sections; the built-in ones override it */
.pattern-section { --pattern-color: var(--primary-400); }
.pattern-signal { --pattern-color: var(--one-dark-red); }
.pattern-template { --pattern-color: var(--one-dark-blue); }
.pattern-alternatives { --pattern-color: var(--one-dark-yellow); }

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
  color: color-mix(in srgb, var(--pattern-color) var(--ink-depth), var(--ink-mix));
}


.pattern-body {
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--text-primary);
}

.pattern-body :deep(code) {
  font-size: 0.75rem;
}
</style>
