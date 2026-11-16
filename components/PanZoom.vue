<template>
  <!-- A big picture or diagram (its slot) that pans and zooms in place: the
       wheel or +/− zooms around the pointer, dragging pans, double-click or 0
       resets. The slide's keys still work; exports show the start view. -->
  <div
    ref="frame"
    class="pan-zoom"
    :style="{ height }"
    tabindex="0"
    @wheel.prevent="wheel"
    @pointerdown="drag"
    @dblclick="reset"
    @keydown="key"
  >
    <div class="pz-content" :style="{ transform: `translate(${x}px, ${y}px) scale(${scale})` }">
      <slot />
    </div>
    <div class="pz-hint">{{ Math.round(scale * 100) }}%</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  height: { type: String, default: '20rem' },
  /** The zoom to start at */
  initial: { type: Number, default: 1 },
  max: { type: Number, default: 6 },
})

const frame = ref<HTMLElement>()
const scale = ref(props.initial)
const x = ref(0)
const y = ref(0)

function zoomAt(factor: number, cx: number, cy: number) {
  const s = Math.min(props.max, Math.max(0.5, scale.value * factor))
  const k = s / scale.value
  x.value = cx - (cx - x.value) * k
  y.value = cy - (cy - y.value) * k
  scale.value = s
}

function local(e: { clientX: number, clientY: number }) {
  const r = frame.value!.getBoundingClientRect()
  // the slide is scaled to the window: back to its own pixels
  const ratio = r.width / frame.value!.offsetWidth || 1
  return [(e.clientX - r.left) / ratio, (e.clientY - r.top) / ratio] as const
}

function wheel(e: WheelEvent) {
  const [cx, cy] = local(e)
  zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, cx, cy)
}

function drag(e: PointerEvent) {
  e.stopPropagation()
  const sx = e.clientX
  const sy = e.clientY
  const ox = x.value
  const oy = y.value
  const ratio = frame.value!.getBoundingClientRect().width / frame.value!.offsetWidth || 1
  const move = (ev: PointerEvent) => { x.value = ox + (ev.clientX - sx) / ratio; y.value = oy + (ev.clientY - sy) / ratio }
  const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
}

function reset() {
  scale.value = props.initial
  x.value = 0
  y.value = 0
}

function key(e: KeyboardEvent) {
  const w = frame.value!.offsetWidth / 2
  const h = frame.value!.offsetHeight / 2
  if (e.key === '+' || e.key === '=') { e.stopPropagation(); zoomAt(1.25, w, h) }
  else if (e.key === '-') { e.stopPropagation(); zoomAt(0.8, w, h) }
  else if (e.key === '0') { e.stopPropagation(); reset() }
}
</script>

<style scoped>
.pan-zoom {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--text-primary) 3%, transparent);
  cursor: grab;
  touch-action: none;
  outline: none;
}
.pan-zoom:active { cursor: grabbing; }
.pan-zoom:focus-visible { box-shadow: 0 0 0 2px var(--primary-400); }

.pz-content {
  transform-origin: 0 0;
  width: 100%;
  height: 100%;
}
.pz-content > :deep(*) { max-width: none; }

.pz-hint {
  position: absolute;
  right: 0.5rem;
  bottom: 0.4rem;
  padding: 0.05rem 0.45rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-family: var(--font-mono);
  font-size: 0.6rem;
}
.print-mode .pz-hint { display: none; }
</style>
