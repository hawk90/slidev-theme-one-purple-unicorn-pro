<template>
  <!-- A long document on one slide (a spec, an ADR, a README): its own `##`
       headings become an index rail, and each click scrolls the text to the
       next section (a click on the rail jumps there). The steps count in the
       slide's clicks; an export shows the last section (or every one with
       --with-clicks). -->
  <div class="slidev-layout document">
    <nav v-if="heads.length > 1" class="doc-rail" aria-label="Sections">
      <button
        v-for="(h, i) in heads"
        :key="i"
        type="button"
        class="doc-rail-item"
        :class="{ 'doc-rail-active': i === index, 'doc-rail-done': i < index }"
        @click="jump($event, i)"
        @keydown.space.stop
      >
        <span class="doc-rail-dot" />{{ h }}
      </button>
    </nav>
    <div ref="body" class="doc-body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
let nextId = 0
</script>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'

const body = ref<HTMLElement>()
const heads = ref<string[]>([])
const info = shallowRef<{ start: number } | null>(null)

function context() {
  try { return useSlideContext() }
  catch { return undefined }
}
const ctx = context()
const clicks = ctx?.$clicksContext
const nav = useNav()

// The sections are known once the Markdown has rendered; the clicks are
// claimed then (as v-click does when it mounts)
let id = ''
onMounted(() => {
  heads.value = [...(body.value?.querySelectorAll('h2') ?? [])].map(h => h.textContent?.trim() ?? '')
  if (clicks && heads.value.length > 1) {
    const i = clicks.calculateSince('+1', heads.value.length - 1)
    if (i) {
      id = `document-${nextId++}`
      clicks.register(id, i)
      info.value = i
    }
  }
  nextTick(follow)
})
onUnmounted(() => { if (id) clicks?.unregister(id) })

const index = computed(() => {
  if (!heads.value.length) return 0
  if (!clicks || !info.value) return heads.value.length - 1
  return Math.max(0, Math.min(heads.value.length - 1, clicks.current - info.value.start + 1))
})

function follow() {
  const el = body.value
  const h = el?.querySelectorAll('h2')[index.value] as HTMLElement | undefined
  if (el && h) el.scrollTo({ top: h.offsetTop - el.offsetTop, behavior: 'smooth' })
}
watch(index, follow)

function jump(event: MouseEvent, i: number) {
  if (event.detail > 0) (event.currentTarget as HTMLElement).blur()
  if (info.value && ctx?.$page) nav.go(ctx.$page.value, info.value.start + i - 1)
}
</script>

<style scoped>
/* Variables: --document-rail-width (12rem) */
.document {
  display: grid;
  grid-template-columns: var(--document-rail-width, 12rem) 1fr;
  gap: 1.5rem;
  height: 100%;
}

.doc-rail {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding-top: 0.25rem;
  border-right: 1px solid var(--border-default);
  padding-right: 0.75rem;
  overflow: hidden;
}

.doc-rail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.4rem;
  border: 0;
  border-radius: 6px;
  background: none;
  color: var(--text-muted);
  font: inherit;
  font-size: 0.75rem;
  text-align: left;
  cursor: pointer;
  transition: color var(--transition-fast), background var(--transition-fast);
}

.doc-rail-item:hover { color: var(--text-primary); }
.doc-rail-done { color: var(--text-secondary); }

.doc-rail-active {
  color: var(--primary-400);
  font-weight: 700;
  background: color-mix(in srgb, var(--primary-400) 10%, transparent);
}

.doc-rail-dot {
  flex: none;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.7;
}

.doc-body {
  min-height: 0;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  font-size: 0.9em;
}

/* room after the text, so the last section can scroll up to the top */
.doc-body::after {
  content: '';
  display: block;
  height: calc(100% - 4rem);
}

.doc-body > :deep(h2) {
  scroll-margin-top: 0;
  padding-top: 0.25rem;
  border-top: 1px solid var(--border-default);
}

.doc-body > :deep(h2:first-child) { border-top: 0; margin-top: 0; }
</style>
