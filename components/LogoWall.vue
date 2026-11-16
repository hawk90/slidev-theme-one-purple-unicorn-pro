<template>
  <!-- Logos (sponsors, users, tools) in even rows, quiet (grey) until hovered -->
  <div class="logo-wall" :class="{ 'logo-wall-color': color }" :style="{ '--_cols': cols }">
    <component
      :is="item.url ? 'a' : 'div'"
      v-for="(item, i) in items"
      :key="i"
      class="logo-wall-item"
      :href="item.url || undefined"
      :target="item.url ? '_blank' : undefined"
      :rel="item.url ? 'noopener' : undefined"
    >
      <img v-if="item.src" :src="resolveAssetUrl(item.src)" :alt="item.name" class="logo-wall-img">
      <span v-else class="logo-wall-name">{{ item.name }}</span>
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveAssetUrl } from '@slidev/client'
import { wallColumns } from '../utils/media'

interface Logo { src?: string, name?: string, url?: string }

const props = defineProps({
  /** Image paths, or { src, name, url } (a name alone shows as text) */
  logos: { type: Array as () => (string | Logo)[], required: true },
  /** Columns; by default from the count (utils/media.ts wallColumns) */
  columns: { type: [Number, String], default: undefined },
  /** Show the logos in their colors (grey until hovered by default) */
  color: { type: Boolean, default: false },
})

const items = computed(() => props.logos.map(l => (typeof l === 'string' ? { src: l, name: '' } : { name: '', ...l })))
const cols = computed(() => Number(props.columns) || wallColumns(items.value.length))
</script>

<style scoped>
/* Variables: --logo-wall-height (a logo's height, 3rem), --logo-wall-gap */
.logo-wall {
  display: grid;
  grid-template-columns: repeat(var(--_cols), 1fr);
  gap: var(--logo-wall-gap, 1.25rem 2rem);
  align-items: center;
  justify-items: center;
  margin: 1rem 0;
}

.logo-wall-item {
  display: grid;
  place-items: center;
  width: 100%;
  height: calc(var(--logo-wall-height, 3rem) + 1.5rem);
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  border: 0;
  text-decoration: none;
  transition: background var(--transition-base);
}

.logo-wall-item:hover {
  background: color-mix(in srgb, var(--text-primary) 5%, transparent);
}

.logo-wall-img {
  max-width: 100%;
  max-height: var(--logo-wall-height, 3rem);
  margin: 0;
  object-fit: contain;
  filter: grayscale(1);
  opacity: 0.75;
  transition: filter var(--transition-base), opacity var(--transition-base);
}

.logo-wall-color .logo-wall-img,
.logo-wall-item:hover .logo-wall-img {
  filter: none;
  opacity: 1;
}

.logo-wall-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-secondary);
  letter-spacing: -0.01em;
}
</style>
