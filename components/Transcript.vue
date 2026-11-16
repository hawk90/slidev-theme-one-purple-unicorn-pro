<template>
  <!-- A chat or agent session, one turn per click (user, agent, tool), in a
       window of fixed height that scrolls to the newest turn; a badge counts
       the turns gone out of view above. Exports show the last turns. -->
  <div class="transcript" :style="{ height }">
    <div v-if="above > 0" class="tr-above">↑ {{ above }} above</div>
    <div ref="scroller" class="tr-scroll">
      <div v-for="(t, i) in shown" :key="i" class="tr-turn" :class="`tr-${t.role}`">
        <div class="tr-who">{{ t.name || names[t.role] || t.role }}</div>
        <div class="tr-text" v-html="richText(t.text)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
let nextId = 0
</script>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import { richText } from '../utils/rich-text'

interface Turn { role: 'user' | 'agent' | 'tool' | 'system', text: string, name?: string }

const props = defineProps({
  /** [{ role: user | agent | tool | system, text, name }] */
  turns: { type: Array as () => Turn[], required: true },
  /** Turns shown before the first click (1) */
  start: { type: Number, default: 1 },
  height: { type: String, default: '20rem' },
})

const names: Record<string, string> = { user: 'You', agent: 'Agent', tool: 'Tool', system: 'System' }

function context() {
  try { return useSlideContext().$clicksContext }
  catch { return undefined }
}
const clicks = context()
const steps = Math.max(0, props.turns.length - props.start)
const info = steps ? clicks?.calculateSince('+1', steps) ?? null : null
if (clicks && info) {
  const id = `transcript-${nextId++}`
  clicks.register(id, info)
  onUnmounted(() => clicks.unregister(id))
}

const count = computed(() => {
  if (!clicks || !info) return props.turns.length
  return Math.min(props.turns.length, props.start + Math.max(0, clicks.current - info.start + 1))
})
const shown = computed(() => props.turns.slice(0, count.value))

// Scroll to the newest turn, and count the turns entirely above the view
const scroller = ref<HTMLElement>()
const above = ref(0)
async function follow() {
  await nextTick()
  const el = scroller.value
  if (!el) return
  // where it scrolls to (smooth: scrollTop gets there later)
  const top = Math.max(0, el.scrollHeight - el.clientHeight)
  el.scrollTop = top
  above.value = [...el.children].filter(c => (c as HTMLElement).offsetTop + (c as HTMLElement).offsetHeight <= top + 2).length
}
watch(count, follow)
onMounted(follow)
</script>

<style scoped>
/* Variables: --transcript-user, --transcript-agent, --transcript-tool */
.transcript {
  position: relative;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--text-primary) 3%, transparent);
  overflow: hidden;
  text-align: left;
}

.tr-scroll {
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  scrollbar-width: none;
}

.tr-above {
  position: absolute;
  top: 0.4rem;
  left: 50%;
  translate: -50% 0;
  z-index: 1;
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  font-size: 0.65rem;
  color: var(--text-secondary);
}

.tr-turn {
  max-width: 85%;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  line-height: 1.45;
  animation: fade-up var(--motion-base, 0.4s) var(--motion-ease, ease) both;
}

.tr-user {
  align-self: flex-end;
  background: color-mix(in srgb, var(--transcript-user, var(--primary-400)) 18%, transparent);
  border-bottom-right-radius: 4px;
}

.tr-agent {
  align-self: flex-start;
  background: color-mix(in srgb, var(--transcript-agent, var(--one-dark-cyan)) 14%, transparent);
  border-bottom-left-radius: 4px;
}

.tr-tool,
.tr-system {
  align-self: stretch;
  max-width: none;
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  border-left: 3px solid var(--transcript-tool, var(--one-dark-yellow));
  background: color-mix(in srgb, var(--transcript-tool, var(--one-dark-yellow)) 8%, transparent);
  font-family: var(--font-mono);
  font-size: 0.7rem;
}

.tr-who {
  margin-bottom: 0.15rem;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--text-primary) 70%, var(--text-secondary)); /* AA on the bubbles */
}

.print-mode .tr-turn { animation: none; }
</style>
