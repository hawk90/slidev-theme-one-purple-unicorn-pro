<template>
  <div class="timeline">
    <div
      v-for="(item, i) in items"
      :key="`tl-${i}`"
      class="tl-item"
      :class="{ 'tl-active': i === active }"
    >
      <div class="tl-marker">
        <div class="tl-dot" :style="item.color ? { '--tl-dot-color': item.color, '--tl-active-color': item.color } : undefined" />
        <div v-if="i < items.length - 1" class="tl-line" />
      </div>
      <div class="tl-content">
        <div v-if="item.year" class="tl-year">{{ item.year }}</div>
        <div class="tl-title" v-html="richText(item.title)" />
        <div v-if="item.desc" class="tl-desc" v-html="richText(item.desc)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
interface TimelineItem {
  title: string
  year?: string
  desc?: string
  color?: string // dot color for this item
}
</script>

<script setup lang="ts">
import { richText } from '../utils/rich-text'

defineProps({
  items: { type: Array as () => TimelineItem[], required: true },
  active: { type: Number, default: -1 },
})
</script>

<style scoped>
/* Variables: --tl-dot-color, --tl-active-color, --tl-line-color, --tl-year-color;
   per item: { color } */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0.75rem 0;
}

.tl-item {
  display: flex;
  gap: 0.75rem;
  min-height: 3rem;
}

.tl-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 1rem;
}

.tl-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--tl-dot-color, var(--text-muted, #5c6370));
  flex-shrink: 0;
  margin-top: 0.3rem;
  transition: all 0.2s ease;
}

.tl-active .tl-dot {
  background: var(--tl-active-color, var(--primary-400, #c678dd));
  box-shadow: 0 0 6px var(--tl-active-color, var(--primary-400, #c678dd));
  width: 10px;
  height: 10px;
}

.tl-line {
  width: 2px;
  flex: 1;
  background: var(--tl-line-color, var(--border-default, rgba(255, 255, 255, 0.1)));
  margin: 0.25rem 0;
}

.tl-content {
  padding-bottom: 0.75rem;
}

.tl-year {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--tl-year-color, var(--primary-400, #c678dd));
  font-weight: 600;
}

.tl-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary, #dce0e8);
}

.tl-desc {
  font-size: 0.75rem;
  color: var(--text-muted, #5c6370);
  margin-top: 0.15rem;
}
</style>
