<template>
  <div class="slidev-layout two-cols-header-layout">
    <div class="col-header">
      <slot />
    </div>
    <div class="columns" :class="{ 'columns-divided': divider }" :style="columnsStyle">
      <div class="col-left">
        <slot name="left" />
      </div>
      <div class="col-right">
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
})

const columnsStyle = computed(() => ({
  gridTemplateColumns: props.divider
    ? `${props.leftWidth} 1px ${props.rightWidth}`
    : `${props.leftWidth} ${props.rightWidth}`,
}))
</script>

<style scoped>
.two-cols-header-layout {
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

.col-bottom {
  flex-shrink: 0;
}
</style>
