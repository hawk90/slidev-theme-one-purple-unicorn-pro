<template>
  <!-- A GitHub issue or pull request as a card (what you give it; nothing is
       fetched, so it works offline and in exports) -->
  <component :is="href ? 'a' : 'div'" class="gh-card" :href="href || undefined" target="_blank" rel="noopener">
    <div class="gh-head">
      <span class="gh-state" :class="`gh-${stateKind}`">{{ stateIcon }} {{ stateText }}</span>
      <span class="gh-repo">{{ repo }}<span v-if="number"> #{{ number }}</span></span>
    </div>
    <div class="gh-title">{{ title }}</div>
    <div v-if="labels.length || author" class="gh-foot">
      <span v-for="l in labels" :key="l" class="gh-label">{{ l }}</span>
      <span v-if="author" class="gh-author">by {{ author }}</span>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  /** issue | pr */
  type: { type: String, default: 'issue' },
  /** owner/name */
  repo: { type: String, required: true },
  number: { type: [Number, String], default: '' },
  title: { type: String, required: true },
  /** open | closed | merged | draft */
  state: { type: String, default: 'open' },
  author: { type: String, default: '' },
  labels: { type: Array as () => string[], default: () => [] },
})

const href = computed(() => (props.number ? `https://github.com/${props.repo}/${props.type === 'pr' ? 'pull' : 'issues'}/${props.number}` : ''))
const stateKind = computed(() => (['open', 'closed', 'merged', 'draft'].includes(props.state) ? props.state : 'open'))
const stateText = computed(() => stateKind.value[0].toUpperCase() + stateKind.value.slice(1))
const stateIcon = computed(() => ({ open: '●', closed: '✓', merged: '⤴', draft: '◌' } as Record<string, string>)[stateKind.value])
</script>

<style scoped>
.gh-card {
  display: block;
  max-width: 34rem;
  padding: 0.8rem 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: var(--bg-secondary);
  box-shadow: var(--shadow-md);
  color: var(--text-primary);
  text-decoration: none;
  text-align: left;
}

.gh-head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.7rem;
}

.gh-state {
  white-space: nowrap;
  padding: 0.1rem 0.55rem;
  border-radius: 999px;
  font-weight: 700;
  color: #fff;
}
.gh-open { background: #1f883d; }
.gh-closed { background: #8250df; }
.gh-merged { background: #8250df; }
.gh-draft { background: #6e7781; }

.gh-repo { font-family: var(--font-mono); color: var(--text-secondary); }

.gh-title { margin-top: 0.4rem; font-weight: 700; font-size: 0.95rem; }

.gh-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.5rem;
  font-size: 0.65rem;
}

.gh-label {
  padding: 0.05rem 0.5rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--primary-400) 45%, transparent);
  color: var(--primary-400);
}
/* a little lighter on the dark card: AA */
:global(:is(.dark, .slide-dark) .gh-label) { color: color-mix(in srgb, var(--primary-400) 82%, #fff); }

.gh-author { margin-left: auto; color: var(--text-secondary); }
</style>
