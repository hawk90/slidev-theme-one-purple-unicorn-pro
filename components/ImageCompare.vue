<template>
  <!-- Two images of the same size, one over the other, with a handle to drag
       (or a range to set) that reveals the `after` one; exports show the split
       at `position` -->
  <figure class="image-compare" :style="{ width }">
    <div ref="stage" class="ic-stage" @pointerdown="start">
      <img :src="resolveAssetUrl(before)" :alt="beforeLabel" class="ic-img">
      <img :src="resolveAssetUrl(after)" :alt="afterLabel" class="ic-img ic-after" :style="{ clipPath: `inset(0 0 0 ${pos}%)` }">
      <div class="ic-handle" :style="{ left: `${pos}%` }" aria-hidden="true"><span>⇔</span></div>
      <span class="ic-label ic-label-before">{{ beforeLabel }}</span>
      <span class="ic-label ic-label-after">{{ afterLabel }}</span>
    </div>
    <input v-model.number="pos" class="ic-range" type="range" min="0" max="100" :aria-label="`${beforeLabel} / ${afterLabel}`" @keydown.stop>
  </figure>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { resolveAssetUrl } from '@slidev/client'

const props = defineProps({
  before: { type: String, required: true },
  after: { type: String, required: true },
  beforeLabel: { type: String, default: 'Before' },
  afterLabel: { type: String, default: 'After' },
  /** Where the split starts, in % from the left */
  position: { type: Number, default: 50 },
  width: { type: String, default: '100%' },
})

const pos = ref(props.position)
const stage = ref<HTMLElement>()

function start(e: PointerEvent) {
  const el = stage.value
  if (!el) return
  e.preventDefault()
  e.stopPropagation()
  const move = (ev: PointerEvent) => {
    const r = el.getBoundingClientRect()
    pos.value = Math.round(Math.max(0, Math.min(100, ((ev.clientX - r.left) / r.width) * 100)))
  }
  move(e)
  const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
}
</script>

<style scoped>
.image-compare { margin: 0.5rem auto; }

.ic-stage {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  cursor: ew-resize;
  user-select: none;
  touch-action: none;
}

.ic-img {
  display: block;
  width: 100%;
  margin: 0;
  border-radius: 0;
  pointer-events: none;
}

.ic-after {
  position: absolute;
  inset: 0;
  height: 100%;
  object-fit: cover;
}

.ic-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  translate: -1px 0;
  background: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}

.ic-handle span {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #fff;
  color: #222;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.ic-label {
  position: absolute;
  top: 0.5rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.ic-label-before { left: 0.5rem; }
.ic-label-after { right: 0.5rem; }

.ic-range {
  width: 100%;
  margin-top: 0.4rem;
  accent-color: var(--primary-400);
}

.print-mode .ic-range { display: none; }
</style>
