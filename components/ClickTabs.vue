<template>
  <!-- Tabs whose pane changes on each click: one window, several versions
       (kernel v1 / v2 / v3, C++ / Python). It looks like a code group
       (styles/code-theme.css) and claims its clicks from the slide, so the
       slide's click count includes them, as with <v-clicks>. -->
  <div class="slidev-code-group click-tabs">
    <div class="slidev-code-group-tabs click-tabs-bar" role="tablist">
      <button
        v-for="(tab, i) in tabs"
        :key="`ct-${i}`"
        type="button"
        role="tab"
        class="click-tab"
        :class="{ 'click-tab-active': i === active }"
        :aria-selected="i === active"
        @click="pick($event, i)"
        @keydown.space.stop
      >
        <span>{{ tab }}</span>
      </button>
    </div>
    <!-- every pane in the same cell, so the window is as tall as the tallest
         and doesn't jump between steps -->
    <div class="click-tabs-panes">
      <div
        v-for="(tab, i) in tabs"
        :key="`cp-${i}`"
        class="click-tabs-pane"
        :class="{ 'click-tabs-pane-active': i === active }"
        role="tabpanel"
        :aria-hidden="i !== active"
      >
        <slot :name="`tab${i + 1}`" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
let nextId = 0
</script>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'

const props = defineProps({
  /** The tab labels; the panes are the slots tab1, tab2, … in this order */
  tabs: { type: Array as () => string[], required: true },
  /** false: no clicks, the tabs switch on a click of their own */
  steps: { type: Boolean, default: true },
  /** The tab shown first (1-based), without steps */
  active: { type: [Number, String], default: 1 },
})

function context() {
  try {
    const ctx = useSlideContext()
    return { clicks: ctx.$clicksContext, page: ctx.$page }
  }
  catch {
    return undefined
  }
}

// Steps: the first tab shows from the start, then one click per further tab
const ctx = props.steps ? context() : undefined
const clicks = ctx?.clicks
const stepInfo = props.tabs.length > 1 ? clicks?.calculateSince('+1', props.tabs.length - 1) ?? null : null
if (clicks && stepInfo) {
  const id = `click-tabs-${nextId++}`
  clicks.register(id, stepInfo)
  onUnmounted(() => clicks.unregister(id))
}

const own = ref(Math.max(0, Number(props.active) - 1))
const active = computed(() => {
  if (!clicks || !stepInfo) return Math.min(own.value, props.tabs.length - 1)
  return Math.max(0, Math.min(props.tabs.length - 1, clicks.current - stepInfo.start + 1))
})

// A click on a tab goes to its step (the slide's click count follows), or
// just shows it without steps. A mouse click leaves no focus behind, so the
// arrows and space keep driving the slides.
const nav = useNav()
function pick(event: MouseEvent, i: number) {
  if (event.detail > 0) (event.currentTarget as HTMLElement).blur()
  if (clicks && stepInfo && ctx?.page) nav.go(ctx.page.value, stepInfo.start + i - 1)
  else own.value = i
}
</script>

<style scoped>
/* Variables: --click-tabs-active (the underline), --click-tabs-pane-padding
   (around a pane that isn't a code block) */
.click-tabs {
  margin: 0.75rem 0;
}

.click-tabs-bar {
  display: flex;
  align-items: center;
}

.click-tab {
  position: relative;
  padding: 0.45rem 0.5rem;
  background: none;
  border: 0;
  font: inherit;
  color: var(--slidev-code-tab-text-color);
  cursor: pointer;
  line-height: 1em;
  transition: color var(--transition-fast);
}

.click-tab:hover,
.click-tab-active {
  color: var(--slidev-code-tab-active-text-color);
}

.click-tab-active > span::after {
  content: '';
  position: absolute;
  left: 0.5rem;
  right: 0.5rem;
  bottom: 0;
  height: 2px;
  border-radius: 1px;
  background: var(--click-tabs-active, var(--_root-primary-400, #c678dd));
}

.click-tab:focus-visible {
  outline: 1px solid var(--click-tabs-active, var(--_root-primary-400, #c678dd));
  outline-offset: -2px;
  border-radius: 3px;
}

.click-tabs-panes {
  display: grid;
}

.click-tabs-pane {
  grid-area: 1 / 1;
  visibility: hidden;
  opacity: 0;
  transition: opacity var(--motion-base, 0.4s) var(--motion-ease, ease);
}

.click-tabs-pane-active {
  visibility: visible;
  opacity: 1;
}

/* A code block inside is the window's body, not a window of its own */
.click-tabs-pane > :deep(.slidev-code-wrapper) {
  margin: 0 !important;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.click-tabs-pane > :deep(:not(.slidev-code-wrapper)) {
  margin-inline: var(--click-tabs-pane-padding, 0.75rem);
}
</style>
