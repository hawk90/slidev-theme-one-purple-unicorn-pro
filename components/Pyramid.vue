<template>
  <!-- Levels from the narrow top to the wide base (a hierarchy, the memory
       pyramid); each level's label can sit beside it -->
  <div class="pyramid" :style="{ '--_levels': items.length }">
    <div v-for="(l, i) in items" :key="i" class="pyramid-row">
      <div
        class="pyramid-level"
        :style="{ '--_i': i, '--_lvl': l.color ? colorValue(l.color) : undefined }"
      >
        <span v-html="richText(l.title)" />
      </div>
      <div v-if="l.note" class="pyramid-note" v-html="richText(l.note)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { colorValue } from '../utils/colors'
import { richText } from '../utils/rich-text'

interface Level { title: string, note?: string, color?: string }

const props = defineProps({
  /** Top first: titles, or { title, note, color } */
  levels: { type: Array as () => (string | Level)[], required: true },
})

const items = computed(() => props.levels.map(l => (typeof l === 'string' ? { title: l } : l)))
</script>

<style scoped>
/* Variables: --pyramid-color, --pyramid-width (28rem) */
.pyramid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 1rem 0;
}

.pyramid-row {
  display: grid;
  grid-template-columns: var(--pyramid-width, 28rem) 1fr;
  align-items: center;
  gap: 1.25rem;
}

/* Each level: a trapezoid as wide as its place in the stack */
.pyramid-level {
  --_top: calc(var(--_i) / var(--_levels) * 50%);
  --_bottom: calc((var(--_i) + 1) / var(--_levels) * 50%);
  height: 2.6rem;
  display: grid;
  place-items: center;
  clip-path: polygon(calc(50% - var(--_top)) 0, calc(50% + var(--_top)) 0, calc(50% + var(--_bottom)) 100%, calc(50% - var(--_bottom)) 100%);
  /* soft fills under the theme's text: AA in both modes (white on the
     paler levels was 2.2-4.3:1) */
  background: color-mix(in srgb, var(--_lvl, var(--pyramid-color, var(--primary-400))) calc(28% - var(--_i) * 3%), var(--bg-secondary));
  color: var(--text-primary);
  font-weight: 700;
  font-size: 0.8rem;
}

/* the top is a point: its label goes below the middle */
.pyramid-row:first-child .pyramid-level span { translate: 0 0.5rem; font-size: 0.7rem; }

.pyramid-note {
  font-size: 0.8rem;
  color: var(--text-secondary);
  border-left: 2px solid var(--border-default);
  padding-left: 0.75rem;
}
</style>
