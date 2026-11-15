<template>
  <div class="timeline" :class="{ 'tl-steps': stepInfo }">
    <div
      v-for="(item, i) in items"
      :key="`tl-${i}`"
      class="tl-item"
      :class="{
        'tl-active': i === activeIndex,
        'tl-hidden': i >= shown,
        'anim-fade-up': entrance,
      }"
      :style="entrance ? { '--anim-delay': `${i * staggerSeconds}s` } : undefined"
    >
      <div class="tl-marker">
        <div class="tl-dot" :style="item.color ? { '--tl-dot-color': colorValue(item.color), '--tl-active-color': colorValue(item.color) } : undefined" />
        <div v-if="i < items.length - 1" class="tl-line" :class="{ 'tl-line-pending': i + 1 >= shown }" />
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

let nextId = 0
</script>

<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import { useSlideContext } from '@slidev/client'
import { richText } from '../utils/rich-text'
import { colorValue } from '../utils/colors'

const props = defineProps({
  items: { type: Array as () => TimelineItem[], required: true },
  // A static highlight (index); with `steps` the newest item is highlighted
  active: { type: [Number, String], default: -1 },
  // Each click on the slide reveals the next item (counts in the slide's
  // clicks, like <v-clicks>)
  steps: { type: Boolean, default: false },
  // Items fade in top to bottom once the slide has arrived (anim-fade-up)
  animate: { type: Boolean, default: false },
})

const staggerSeconds = 0.12

// Click steps: one click per item, after the clicks before it on the slide
// (Slidev's clicks context, as v-click uses). Outside a slide: no steps.
function clicksContext() {
  try {
    return useSlideContext().$clicksContext
  }
  catch {
    return undefined
  }
}
const clicks = props.steps ? clicksContext() : undefined
const stepInfo = clicks?.calculateSince('+1', props.items.length) ?? null
if (clicks && stepInfo) {
  const id = `timeline-steps-${nextId++}`
  clicks.register(id, stepInfo)
  onUnmounted(() => clicks.unregister(id))
}

// How many items show: all, or one more per click
const shown = computed(() => {
  if (!clicks || !stepInfo) return props.items.length
  return Math.max(0, Math.min(props.items.length, clicks.current - stepInfo.start + 1))
})
const activeIndex = computed(() => stepInfo ? shown.value - 1 : Number(props.active))
// With steps each item already moves in on its click; the entrance's fill
// would show the items not reached yet
const entrance = computed(() => props.animate && !stepInfo)
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

/* Click steps: items not reached yet keep their place, unseen */
.tl-steps .tl-item {
  transition: opacity var(--motion-base, 0.4s) var(--motion-ease, ease),
    transform var(--motion-base, 0.4s) var(--motion-ease, ease);
}

/* ...and the line to the next item waits for it */
.tl-steps .tl-line {
  transition: opacity var(--motion-base, 0.4s) var(--motion-ease, ease);
}

.tl-steps .tl-line-pending {
  opacity: 0;
}

.tl-steps .tl-hidden {
  opacity: 0;
  transform: translateY(var(--motion-distance, 0.75rem));
  pointer-events: none;
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
  background: var(--tl-dot-color, var(--text-muted));
  flex-shrink: 0;
  margin-top: 0.3rem;
  transition: all var(--transition-base);
}

.tl-active .tl-dot {
  background: var(--tl-active-color, var(--primary-400));
  box-shadow: var(--dot-glow) var(--tl-active-color, var(--primary-400));
  width: 10px;
  height: 10px;
}

.tl-line {
  width: 2px;
  flex: 1;
  background: var(--tl-line-color, var(--border-default));
  margin: 0.25rem 0;
}

.tl-content {
  padding-bottom: 0.75rem;
}

.tl-year {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--tl-year-color, var(--primary-400));
  font-weight: 600;
}

.tl-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.tl-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

@media (prefers-reduced-motion: reduce) {
  .tl-steps .tl-item { transition: none; }
}
</style>
