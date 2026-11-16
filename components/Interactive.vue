<template>
  <!-- Something live (its slot: an explorer, a diagram editor, a widget) that
       has a still for exports. In the room it shows the slot, or with
       `dialog`, the still, and a click opens the slot in a dialog over the
       slide (Esc or a click outside closes it). Exports show the still. -->
  <div class="interactive" :style="{ width }">
    <img v-if="print || dialog" :src="resolveAssetUrl(image)" :alt="alt" class="ia-still" :class="{ 'ia-open': dialog && !print }" @click="open">
    <slot v-else />
    <span v-if="dialog && !print" class="ia-hint">click to explore</span>
    <Teleport to="body">
      <div v-if="shown" class="ia-dialog" role="dialog" :aria-label="alt" @click.self="shown = false">
        <div class="ia-panel">
          <button type="button" class="ia-close" aria-label="Close" @click="shown = false">×</button>
          <slot />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { resolveAssetUrl, useNav } from '@slidev/client'

const props = defineProps({
  /** The still, for exports (and the dialog's preview) */
  image: { type: String, required: true },
  alt: { type: String, default: '' },
  /** Show the still and open the slot in a dialog on click */
  dialog: { type: Boolean, default: false },
  width: { type: String, default: '100%' },
})

const { isPrintMode } = useNav()
const print = computed(() => isPrintMode.value)
const shown = ref(false)

function open() { if (props.dialog && !print.value) shown.value = true }

// Esc closes the dialog (and doesn't reach the slides)
function key(e: KeyboardEvent) {
  if (e.key === 'Escape') { e.stopPropagation(); shown.value = false }
}
watch(shown, (v) => {
  if (v) window.addEventListener('keydown', key, true)
  else window.removeEventListener('keydown', key, true)
})
onUnmounted(() => window.removeEventListener('keydown', key, true))
</script>

<style scoped>
.interactive {
  position: relative;
  margin: 0.5rem auto;
}

.ia-still {
  display: block;
  width: 100%;
  margin: 0;
}
.ia-open { cursor: zoom-in; }

.ia-hint {
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  padding: 0.1rem 0.55rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 0.65rem;
  pointer-events: none;
}

.ia-dialog {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
}

.ia-panel {
  position: relative;
  width: min(90vw, 1100px);
  height: min(85vh, 720px);
  padding: 1rem;
  border-radius: 12px;
  background: var(--bg-primary, #fff);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: auto;
}
.ia-panel > :deep(iframe) { width: 100%; height: 100%; border: 0; }

.ia-close {
  position: absolute;
  top: 0.4rem;
  right: 0.6rem;
  z-index: 1;
  border: 0;
  background: none;
  color: var(--text-secondary);
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}
</style>
