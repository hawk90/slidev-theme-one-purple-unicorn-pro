<template>
  <!-- IDE-chrome deck mode (utils/ide.ts): file tabs on top (the slides
       around this one, in its section; a click opens one) and a status bar
       at the bottom (branch, repository, section, page) -->
  <div class="ide-tabs slide-chrome" role="tablist" aria-label="Slides">
    <button
      v-for="t in tabs"
      :key="t.no"
      type="button"
      role="tab"
      class="ide-tab"
      :class="{ 'ide-tab-active': t.no === currentPage }"
      :aria-selected="t.no === currentPage"
      @click="open($event, t.no)"
      @keydown.space.stop
    >
      <span class="ide-tab-icon" aria-hidden="true">M↓</span>{{ t.name }}
    </button>
  </div>
  <div class="ide-status slide-chrome">
    <span class="ide-st-item ide-st-branch">⎇ {{ options.branch }}</span>
    <span v-if="options.repo" class="ide-st-item">{{ options.repo }}</span>
    <span v-if="section" class="ide-st-item ide-st-dim">§ {{ section }}</span>
    <span class="ide-st-spacer" />
    <span class="ide-st-item">Slide {{ currentPage }} / {{ total }}</span>
    <span class="ide-st-item ide-st-dim">UTF-8</span>
    <span class="ide-st-item ide-st-dim">{{ options.language }}</span>
  </div>
</template>

<script lang="ts">
let mounted = 0
</script>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'
import { ideFileName, tabWindow } from '../../utils/ide'
import type { IdeOptions } from '../../utils/ide'
import { autoStageIndex, autoStages } from '../../utils/stages'

const props = defineProps<{ options: IdeOptions }>()
const options = computed(() => props.options)

const { currentPage, total, slides, go } = useNav()

const sections = computed(() => autoStages(slides.value.map(s => ({
  no: s.no,
  title: s.meta?.slide?.title,
  frontmatter: s.no === 1 ? {} : (s.meta?.slide?.frontmatter ?? {}),
}))))

const section = computed(() => {
  const i = autoStageIndex(sections.value.starts, currentPage.value)
  return i >= 0 ? sections.value.stages[i] : ''
})

const tabs = computed(() => tabWindow(currentPage.value, total.value, 6, sections.value.starts).map((no) => {
  const s = slides.value[no - 1]?.meta?.slide
  return { no, name: ideFileName(s?.title, no, no === 1 ? undefined : s?.frontmatter?.file) }
}))

function open(event: MouseEvent, no: number) {
  if (event.detail > 0) (event.currentTarget as HTMLElement).blur()
  go(no)
}

// the slides make room for the tabs and the bar (styles/content.css); an
// export mounts one per page: the class stays while any is mounted
onMounted(() => { if (mounted++ === 0) document.documentElement.classList.add('ide-chrome') })
onUnmounted(() => { if (--mounted === 0) document.documentElement.classList.remove('ide-chrome') })
</script>

<style scoped>
/* Variables: --ide-bar-bg (the status bar), --ide-tab-bg */
.ide-tabs {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 250;
  display: flex;
  height: 28px;
  overflow: hidden;
  background: var(--ide-tab-bg, var(--bg-secondary));
  border-bottom: 1px solid var(--border-default);
}

.ide-tab {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  max-width: 11rem;
  padding: 0 0.75rem;
  border: 0;
  border-right: 1px solid var(--border-default);
  background: none;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.ide-tab:hover { color: var(--text-primary); }

.ide-tab-active {
  color: var(--text-primary);
  background: var(--slide-bg);
  box-shadow: inset 0 2px 0 var(--primary-400);
}

.ide-tab-icon {
  flex: none;
  color: var(--one-dark-blue);
  font-size: 9px;
  font-weight: 700;
}

.ide-status {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 250;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  height: 22px;
  padding: 0 0.75rem;
  background: var(--ide-bar-bg, var(--primary-600, #7c3aed));
  color: #fff;
  font-family: var(--font-mono);
  font-size: 10.5px;
  white-space: nowrap;
  overflow: hidden;
}

.ide-st-dim { opacity: 0.8; }
.ide-st-spacer { flex: 1; }
.ide-st-branch { font-weight: 700; }
</style>
