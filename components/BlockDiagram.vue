<template>
  <!-- Named blocks on a stage, and a focus frame that moves from block to
       block on each click, with a caption per step. The steps count in the
       slide's clicks (as <v-clicks>); an export shows the last one. -->
  <div class="block-diagram" :style="{ height }">
    <div
      v-for="b in blocks"
      :key="b.id"
      class="bd-block"
      :class="{ 'bd-focused': focused?.id === b.id, 'bd-dimmed': focused && focused.id !== b.id }"
      :style="box(b)"
    >
      <span class="bd-label" v-html="richText(b.label ?? b.id)" />
      <span v-if="b.sub" class="bd-sub" v-html="richText(b.sub)" />
    </div>
    <div v-if="focused" class="bd-frame" :style="box(focused)" />
    <div v-if="caption" class="bd-caption" v-html="richText(caption)" />
  </div>
</template>

<script lang="ts">
let nextId = 0
</script>

<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import { useSlideContext } from '@slidev/client'
import { colorValue } from '../utils/colors'
import { richText } from '../utils/rich-text'

interface Block { id: string, label?: string, sub?: string, x: number, y: number, w: number, h: number, color?: string }
interface Step { block: string, caption?: string }

const props = defineProps({
  /** [{ id, label, sub, x, y, w, h, color }]: position and size in % of the stage */
  blocks: { type: Array as () => Block[], required: true },
  /** The focus, one click each: block ids, or { block, caption } */
  steps: { type: Array as () => (string | Step)[], default: () => [] },
  /** The stage's height (16rem) */
  height: { type: String, default: '16rem' },
})

const steps = computed(() => props.steps.map(s => (typeof s === 'string' ? { block: s } : s)))

function context() {
  try { return useSlideContext().$clicksContext }
  catch { return undefined }
}
const clicks = steps.value.length ? context() : undefined
const info = clicks?.calculateSince('+1', steps.value.length) ?? null
if (clicks && info) {
  const id = `block-diagram-${nextId++}`
  clicks.register(id, info)
  onUnmounted(() => clicks.unregister(id))
}

// The step shown: none before the first click, then one per click (all of
// them outside a slide: the last)
const index = computed(() => {
  if (!steps.value.length) return -1
  if (!clicks || !info) return steps.value.length - 1
  return Math.min(steps.value.length - 1, clicks.current - info.start)
})
const step = computed(() => (index.value >= 0 ? steps.value[index.value] : null))
const focused = computed(() => props.blocks.find(b => b.id === step.value?.block) ?? null)
const caption = computed(() => step.value?.caption ?? '')

const box = (b: Block) => ({
  left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`,
  ...(b.color ? { '--_bd': colorValue(b.color) } : {}),
})
</script>

<style scoped>
/* Variables: --block-color, --focus-color */
.block-diagram {
  position: relative;
  margin: 0.75rem 0 2.25rem;
}

.bd-block {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
  border-radius: 10px;
  border: 1.5px solid color-mix(in srgb, var(--_bd, var(--block-color, var(--primary-400))) 55%, transparent);
  background: color-mix(in srgb, var(--_bd, var(--block-color, var(--primary-400))) 14%, var(--bg-secondary));
  color: var(--text-primary);
  text-align: center;
  transition: opacity var(--motion-base, 0.4s) var(--motion-ease, ease);
}

.bd-dimmed { opacity: 0.45; }

.bd-label { font-weight: 700; font-size: 0.85rem; }
.bd-sub { font-size: 0.65rem; color: var(--text-secondary); }

/* The frame glides from block to block */
.bd-frame {
  position: absolute;
  margin: -6px;
  padding: 6px;
  box-sizing: content-box;
  border: 2px solid var(--focus-color, var(--one-dark-yellow));
  border-radius: 14px;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--focus-color, var(--one-dark-yellow)) 20%, transparent);
  pointer-events: none;
  transition: left var(--motion-base, 0.4s) var(--motion-ease, ease), top var(--motion-base, 0.4s) var(--motion-ease, ease),
    width var(--motion-base, 0.4s) var(--motion-ease, ease), height var(--motion-base, 0.4s) var(--motion-ease, ease);
}

.bd-caption {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
}
</style>
