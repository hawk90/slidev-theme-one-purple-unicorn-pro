<template>
  <div class="slidev-layout agenda" :class="`agenda-${variant}`">
    <slot />
    <div class="agenda-body">
      <ol class="agenda-list" :style="listStyle">
        <li
          v-for="(entry, i) in entries"
          :key="`${i}-${entry.title}`"
          class="agenda-item"
          :class="[i < activeIndex ? 'agenda-done' : i === activeIndex ? 'agenda-current' : 'agenda-upcoming', { 'agenda-col-end': i + 1 === colEnd }]"
          :aria-current="i === activeIndex ? 'step' : undefined"
        >
          <button type="button" class="agenda-link" :disabled="!entry.no" @click="entry.no && go(entry.no)">
            <span v-if="variant === 'timeline'" class="agenda-node" aria-hidden="true" />
            <span class="agenda-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="agenda-title">{{ entry.title }}</span>
            <span v-if="i < activeIndex" class="agenda-check" aria-label="done">✓</span>
          </button>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'

// items: the entries (default: the titles of the deck's `section` slides).
// active: which entry is current, 1-based (default: the next section after
// this slide, so an agenda placed before each section marks where the talk is).
// variant: cards (default) | timeline
const props = defineProps({
  items: { type: Array, default: undefined },
  active: { type: Number, default: undefined },
  variant: { type: String, default: 'cards' },
})

const { slides, go } = useNav()
const { $page: page } = useSlideContext()

interface Entry { title: string, no?: number }

const sections = computed<Entry[]>(() => slides.value
  .filter(s => s.meta?.slide?.frontmatter?.layout === 'section')
  .map(s => ({ title: String(s.meta?.slide?.title ?? ''), no: s.no })))

const entries = computed<Entry[]>(() => {
  if (!props.items) return sections.value
  // Own entries jump to the section of the same title, if there is one
  return props.items.map((item) => {
    const title = String(item)
    return { title, no: sections.value.find(s => s.title === title)?.no }
  })
})

const activeIndex = computed(() => {
  if (props.active !== undefined) return props.active - 1
  const next = entries.value.findIndex(e => e.no !== undefined && e.no > page.value)
  // After the last section every entry is done
  return next === -1 ? entries.value.length : next
})

// Timeline in two columns: the first column's last entry has no line below
const colEnd = computed(() => props.variant === 'timeline' && entries.value.length > 6 ? Math.ceil(entries.value.length / 2) : 0)

// Cards: 2 columns up to 4 entries, then 3, then 4. Timeline: one column,
// two (filled top to bottom) past six entries.
const listStyle = computed(() => {
  const n = entries.value.length
  if (props.variant === 'timeline') {
    return n > 6 ? { gridTemplateColumns: '1fr 1fr', gridTemplateRows: `repeat(${Math.ceil(n / 2)}, auto)`, gridAutoFlow: 'column' } : undefined
  }
  const cols = n <= 4 ? 2 : n <= 6 ? 3 : 4
  return { gridTemplateColumns: `repeat(${Math.min(cols, n || 1)}, 1fr)` }
})
</script>

<style scoped>
/* Variables: --agenda-size, --agenda-current-color, --agenda-done-opacity.
   Entry rules start with `.agenda .agenda-list` to outrank the light theme's
   styling of buttons in slides. */
.agenda {
  @apply h-full;
  display: flex;
  flex-direction: column;
}

.agenda-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 2rem;
}

.agenda-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  width: 100%;
}

.agenda-item {
  margin: 0;
  padding: 0;
}

.agenda-item::before {
  content: none;
}

.agenda .agenda-list .agenda-link {
  position: relative;
  width: 100%;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.agenda .agenda-list .agenda-link:disabled {
  cursor: default;
}

.agenda-num {
  font-family: var(--font-mono);
  font-weight: 700;
  line-height: 1;
}

.agenda-title {
  font-size: var(--agenda-size, 1.25rem);
  line-height: 1.35;
  color: var(--text-primary);
}

.agenda-check {
  font-size: 0.9rem;
  color: var(--one-dark-green);
}

/* ---------- Cards ---------- */
.agenda-cards .agenda-list {
  gap: 1.1rem;
  max-width: 52rem;
}

.agenda.agenda-cards .agenda-list .agenda-link {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  height: 100%;
  min-height: 7.5rem;
  padding: 1.35rem 1.5rem;
  border: 2px solid transparent;
  border-radius: 1rem;
  background:
    linear-gradient(var(--bg-secondary), var(--bg-secondary)) padding-box,
    linear-gradient(var(--border-default), var(--border-default)) border-box;
  transition: transform var(--transition-base, 250ms ease), box-shadow var(--transition-base, 250ms ease);
}

.agenda-cards .agenda-num {
  align-self: flex-start; /* the gradient spans the digits, not the card */
  font-size: 2.2rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.agenda-cards .agenda-check {
  position: absolute;
  top: 1.1rem;
  right: 1.25rem;
}

/* Current: gradient ring and glow */
.agenda.agenda-cards .agenda-list .agenda-current .agenda-link {
  background:
    linear-gradient(var(--bg-secondary), var(--bg-secondary)) padding-box,
    var(--gradient-primary) border-box;
  box-shadow: 0 0 28px color-mix(in srgb, var(--agenda-current-color, var(--primary-400)) 35%, transparent);
  transform: translateY(-3px);
}

.agenda-cards .agenda-current .agenda-title {
  font-weight: 600;
  color: var(--text-bright);
}

.agenda .agenda-list .agenda-done .agenda-link {
  opacity: var(--agenda-done-opacity, 0.5);
}

.agenda-cards .agenda-done .agenda-num {
  background: none;
  -webkit-text-fill-color: var(--text-muted);
}

.agenda.agenda-cards .agenda-list .agenda-link:not(:disabled):hover {
  transform: translateY(-3px);
}

/* ---------- Timeline ---------- */
.agenda-timeline .agenda-list {
  column-gap: 4rem;
  max-width: 44rem;
}

.agenda.agenda-timeline .agenda-list .agenda-link {
  display: grid;
  grid-template-columns: 2.25rem 2.5rem auto auto;
  justify-content: start;
  column-gap: 0;
  align-items: center;
  padding: 0.85rem 0;
}

/* The line through the nodes */
.agenda-timeline .agenda-item {
  position: relative;
}

.agenda-timeline .agenda-item::after {
  content: '';
  position: absolute;
  left: calc(0.6rem - 1px);
  top: 50%;
  height: 100%;
  width: 2px;
  background: var(--gradient-primary);
  opacity: 0.35;
}

.agenda-timeline .agenda-item:last-child::after,
.agenda-timeline .agenda-col-end::after {
  content: none;
}

.agenda-node {
  position: relative;
  z-index: 1;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  border: 2px solid var(--text-muted);
  background: var(--agenda-node-bg, var(--dark-bg));
  box-sizing: border-box;
}

/* Upcoming nodes are hollow: filled with the slide background */
html:not(.dark) .agenda-timeline {
  --agenda-node-bg: var(--light-bg, #fff);
}

.agenda-timeline .agenda-check {
  margin-left: 0.75rem;
}

.agenda-timeline .agenda-num {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.agenda-timeline .agenda-title {
  font-size: var(--agenda-size, 1.4rem);
}

.agenda-timeline .agenda-done .agenda-node {
  background: var(--text-muted);
}

.agenda-timeline .agenda-current .agenda-node {
  border: 0;
  background: var(--gradient-primary);
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--agenda-current-color, var(--primary-400)) 25%, transparent),
    0 0 18px color-mix(in srgb, var(--agenda-current-color, var(--primary-400)) 60%, transparent);
}

.agenda-timeline .agenda-current .agenda-num {
  color: var(--agenda-current-color, var(--primary-400));
}

.agenda-timeline .agenda-current .agenda-title {
  font-weight: 600;
  color: var(--text-bright);
}
</style>
