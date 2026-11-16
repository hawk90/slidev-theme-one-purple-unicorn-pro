<template>
  <!-- People in even rows: avatar (or initials), name, role -->
  <div class="team-grid" :style="{ '--_cols': cols }">
    <div v-for="(p, i) in people" :key="i" class="team-member">
      <img v-if="p.avatar" :src="resolveAssetUrl(p.avatar)" alt="" class="team-avatar">
      <div v-else class="team-avatar team-initials" aria-hidden="true">{{ initials(p.name) }}</div>
      <div class="team-name">{{ p.name }}</div>
      <div v-if="p.role" class="team-role">{{ p.role }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveAssetUrl } from '@slidev/client'
import { wallColumns } from '../utils/media'

interface Member { name: string, role?: string, avatar?: string }

const props = defineProps({
  /** [{ name, role, avatar }] */
  people: { type: Array as () => Member[], required: true },
  columns: { type: [Number, String], default: undefined },
})

const cols = computed(() => Number(props.columns) || wallColumns(props.people.length))
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => [...w][0]).join('').toUpperCase()
</script>

<style scoped>
/* Variables: --team-avatar-size (4rem) */
.team-grid {
  display: grid;
  grid-template-columns: repeat(var(--_cols), 1fr);
  gap: 1.5rem 1rem;
  margin: 1rem 0;
  text-align: center;
}

.team-member {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.team-avatar {
  width: var(--team-avatar-size, 4rem);
  height: var(--team-avatar-size, 4rem);
  margin: 0 0 0.4rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid color-mix(in srgb, var(--primary-400) 60%, transparent);
}

.team-initials {
  display: grid;
  place-items: center;
  background: var(--gradient-primary);
  color: #fff;
  font-weight: 700;
  font-size: calc(var(--team-avatar-size, 4rem) * 0.34);
}

.team-name { font-weight: 700; font-size: 0.9rem; color: var(--text-primary); }
.team-role { font-size: 0.75rem; color: var(--text-secondary); }
</style>
