<template>
  <div class="slidev-layout two-cols-layout">
    <div class="col-header">
      <slot />
    </div>
    <div class="columns" :class="{ 'columns-divided': divider }" :style="columnsStyle">
      <div class="col-left">
        <div v-if="leftLabel" class="col-label col-label-left">{{ leftLabel }}</div>
        <slot name="left" />
      </div>
      <div class="col-right">
        <div v-if="rightLabel" class="col-label col-label-right">{{ rightLabel }}</div>
        <slot name="right" />
      </div>
    </div>
    <div class="col-bottom">
      <slot name="bottom" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  leftWidth: { type: String, default: '1fr' },
  rightWidth: { type: String, default: '1fr' },
  divider: { type: Boolean, default: false },
  leftLabel: { type: String, default: '' },
  rightLabel: { type: String, default: '' },
})

const columnsStyle = computed(() => ({
  gridTemplateColumns: props.divider
    ? `${props.leftWidth} 1px ${props.rightWidth}`
    : `${props.leftWidth} ${props.rightWidth}`,
}))
</script>

<style scoped>
.two-cols-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.col-header {
  flex-shrink: 0;
}

.columns {
  display: grid;
  gap: 2rem;
  flex: 1;
}

.columns-divided {
  gap: 1.5rem;
}

.columns-divided::after {
  content: '';
  grid-column: 2;
  grid-row: 1;
  width: 1px;
  height: 100%;
  background: var(--border-default, rgba(171, 178, 191, 0.15));
}

.col-label {
  font-family: var(--slidev-theme-font-mono, 'JetBrains Mono', monospace);
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  width: fit-content;
  margin-bottom: 0.5rem;
}

.col-label-left {
  background: rgba(59, 130, 246, 0.15);
  color: var(--one-dark-blue, #61afef);
}

.col-label-right {
  background: rgba(16, 185, 129, 0.15);
  color: var(--one-dark-green, #98c379);
}

.col-bottom {
  flex-shrink: 0;
}
</style>
