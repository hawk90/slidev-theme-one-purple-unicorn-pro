<template>
  <!-- A slide's own background, behind its content (the parent isolates it):
       `background` (image / color / gradient) with backgroundOpacity and
       backgroundFilter on this layer only, so the text stays sharp; a scrim
       over images; and a generated `bg:` pattern (utils/background.ts) -->
  <div v-if="image || pattern" class="slide-bg-layer" aria-hidden="true">
    <div v-if="image" class="slide-bg-image" :style="image" />
    <div v-if="pattern" class="slide-bg-pattern" :class="`slide-bg-${pattern}`" />
    <div v-if="scrim !== null" class="slide-bg-scrim" :style="{ '--_scrim': scrim }" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveAssetUrl, useSlideContext } from '@slidev/client'
import { backgroundKind, opacityOf, patternOf, scrimOf } from '../../utils/background'

const { $frontmatter } = useSlideContext()
const fm = computed(() => ($frontmatter ?? {}) as Record<string, unknown>)

const kind = computed(() => {
  const v = fm.value.background
  return typeof v === 'string' && v.trim() ? backgroundKind(v) : null
})

const image = computed(() => {
  const v = String(fm.value.background ?? '').trim()
  if (!kind.value) return null
  const style: Record<string, string> = {}
  if (kind.value === 'color') style.backgroundColor = v
  else if (kind.value === 'gradient') style.backgroundImage = v
  else style.backgroundImage = `url("${resolveAssetUrl(v)}")`
  const opacity = opacityOf(fm.value.backgroundOpacity)
  if (opacity !== null) style.opacity = String(opacity)
  const filter = fm.value.backgroundFilter
  if (typeof filter === 'string' && filter.trim()) style.filter = filter
  return style
})

const pattern = computed(() => patternOf(fm.value.bg))
const scrim = computed(() => scrimOf(fm.value.backgroundScrim, kind.value))
</script>

<style>
/* Unscoped. The parent (CenteredSlide, the default layout) has the class
   slide-bg-host: its own stacking context, so z-index -1 stays above its
   background and below its content */
.slide-bg-host {
  position: relative;
  isolation: isolate;
}

.slide-bg-layer {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.slide-bg-layer > * {
  position: absolute;
  inset: 0;
}

.slide-bg-image {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

/* The scrim takes the slide's own background color, so dark text on a light
   slide and light text on a dark one both stay readable */
.slide-bg-scrim {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--slide-bg, var(--dark-bg)) calc(var(--_scrim) * 85%), transparent),
    color-mix(in srgb, var(--slide-bg, var(--dark-bg)) calc(var(--_scrim) * 115%), transparent)
  );
}

/* Generated patterns, from the accent (follow themeConfig and light mode).
   Theme variables: --bg-pattern-a / -b / -c (colors), --bg-pattern-strength */
.slide-bg-pattern {
  --_a: var(--bg-pattern-a, var(--primary-400));
  --_b: var(--bg-pattern-b, var(--secondary-400, var(--one-dark-blue)));
  --_c: var(--bg-pattern-c, var(--one-dark-cyan));
  --_k: var(--bg-pattern-strength, 1);
}

.slide-bg-mesh {
  background:
    radial-gradient(at 12% 18%, color-mix(in srgb, var(--_a) calc(32% * var(--_k)), transparent) 0, transparent 50%),
    radial-gradient(at 88% 12%, color-mix(in srgb, var(--_b) calc(28% * var(--_k)), transparent) 0, transparent 48%),
    radial-gradient(at 80% 88%, color-mix(in srgb, var(--_c) calc(24% * var(--_k)), transparent) 0, transparent 52%),
    radial-gradient(at 18% 92%, color-mix(in srgb, var(--_a) calc(18% * var(--_k)), transparent) 0, transparent 45%);
}

.slide-bg-aurora {
  background:
    radial-gradient(ellipse 70% 40% at 25% 0%, color-mix(in srgb, var(--_c) calc(34% * var(--_k)), transparent), transparent 70%),
    radial-gradient(ellipse 60% 45% at 75% 5%, color-mix(in srgb, var(--_a) calc(36% * var(--_k)), transparent), transparent 70%),
    radial-gradient(ellipse 80% 35% at 50% 18%, color-mix(in srgb, var(--_b) calc(22% * var(--_k)), transparent), transparent 75%);
  filter: blur(18px);
  inset: -24px;
}

.slide-bg-grain {
  background:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"),
    linear-gradient(135deg, color-mix(in srgb, var(--_a) calc(16% * var(--_k)), transparent), color-mix(in srgb, var(--_b) calc(12% * var(--_k)), transparent));
  opacity: 0.5;
}

.slide-bg-dots {
  background-image: radial-gradient(color-mix(in srgb, var(--_a) calc(38% * var(--_k)), transparent) 1.2px, transparent 1.6px);
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse 85% 80% at 50% 50%, #000 40%, transparent 100%);
}

.slide-bg-grid {
  background-image:
    linear-gradient(color-mix(in srgb, var(--_a) calc(20% * var(--_k)), transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--_a) calc(20% * var(--_k)), transparent) 1px, transparent 1px);
  background-size: 36px 36px;
  background-position: center;
  mask-image: radial-gradient(ellipse 80% 75% at 50% 50%, #000 35%, transparent 100%);
}
</style>
