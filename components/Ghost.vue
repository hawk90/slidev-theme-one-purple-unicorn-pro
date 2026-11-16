<template>
  <!-- A giant faint glyph behind the slide's content: a number, a word, an
       emoji. Placed in a corner (or the middle), it doesn't take room. -->
  <div ref="root" class="ghost" :class="`ghost-${position}`" :style="style" aria-hidden="true">{{ text }}</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { colorValue } from '../utils/colors'

const props = defineProps({
  text: { type: [String, Number], required: true },
  /** bottom-right (default) | top-right | bottom-left | top-left | center */
  position: { type: String, default: 'bottom-right' },
  /** CSS font size (18rem by default) */
  size: { type: String, default: '' },
  color: { type: String, default: 'primary' },
  /** 0–1 (0.07 by default) */
  opacity: { type: [Number, String], default: undefined },
})

const style = computed(() => ({
  '--_ghost': colorValue(props.color) ?? props.color,
  ...(props.size ? { '--_ghost-size': props.size } : {}),
  ...(props.opacity !== undefined ? { '--_ghost-opacity': String(props.opacity) } : {}),
}))

// behind the content: its layout becomes a stacking context of its own (as
// for slide backgrounds), so z-index -1 stays above the slide's background
const root = ref<HTMLElement>()
onMounted(() => root.value?.closest('.slidev-layout')?.classList.add('slide-bg-host'))
</script>

<style scoped>
/* Variables: --ghost-size, --ghost-opacity */
.ghost {
  position: absolute;
  z-index: -1;
  font-size: var(--_ghost-size, var(--ghost-size, 18rem));
  font-weight: 900;
  line-height: 0.8;
  letter-spacing: -0.04em;
  color: var(--_ghost);
  opacity: var(--_ghost-opacity, var(--ghost-opacity, 0.07));
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}
.ghost-bottom-right { right: -0.04em; bottom: -0.06em; }
.ghost-top-right { right: -0.04em; top: 0.05em; }
.ghost-bottom-left { left: -0.04em; bottom: -0.06em; }
.ghost-top-left { left: -0.04em; top: 0.05em; }
.ghost-center { left: 50%; top: 50%; translate: -50% -50%; }
</style>
