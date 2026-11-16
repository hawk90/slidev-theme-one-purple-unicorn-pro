<template>
  <!-- Photos in even rows, cropped to one shape, with optional captions -->
  <div class="photo-wall" :style="{ '--_cols': cols, '--_ratio': ratio }">
    <figure v-for="(p, i) in items" :key="i" class="photo-wall-item">
      <img :src="resolveAssetUrl(p.src)" :alt="p.caption || ''" class="photo-wall-img">
      <figcaption v-if="p.caption" class="photo-wall-caption">{{ p.caption }}</figcaption>
    </figure>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveAssetUrl } from '@slidev/client'
import { wallColumns } from '../utils/media'

interface Photo { src: string, caption?: string }

const props = defineProps({
  /** Image paths, or { src, caption } */
  photos: { type: Array as () => (string | Photo)[], required: true },
  columns: { type: [Number, String], default: undefined },
  /** Each photo's shape, as a CSS aspect-ratio (4/3 by default) */
  ratio: { type: String, default: '4 / 3' },
})

const items = computed(() => props.photos.map(p => (typeof p === 'string' ? { src: p } : p)))
const cols = computed(() => Number(props.columns) || wallColumns(items.value.length))
</script>

<style scoped>
/* Variables: --photo-wall-gap (0.6rem) */
.photo-wall {
  display: grid;
  grid-template-columns: repeat(var(--_cols), 1fr);
  gap: var(--photo-wall-gap, 0.6rem);
  margin: 1rem 0;
}

.photo-wall-item {
  position: relative;
  margin: 0;
  overflow: hidden;
  border-radius: var(--radius-lg);
  aspect-ratio: var(--_ratio);
  box-shadow: var(--shadow-md);
}

.photo-wall-img {
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: cover;
  border-radius: 0;
  transition: scale var(--transition-slow);
}

.photo-wall-item:hover .photo-wall-img { scale: 1.04; }

.photo-wall-caption {
  position: absolute;
  inset: auto 0 0;
  padding: 0.6rem 0.75rem 0.45rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
  font-size: 0.7rem;
  text-align: left;
}
</style>
