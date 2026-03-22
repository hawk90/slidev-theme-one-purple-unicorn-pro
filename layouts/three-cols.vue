<template>
  <div class="slidev-layout three-cols-layout">
    <div class="col-header">
      <slot />
    </div>
    <div class="columns" :class="{ 'columns-divided': divider }" :style="columnsStyle">
      <div class="col-left">
        <slot name="left" />
      </div>
      <div v-if="divider" class="col-divider" />
      <div class="col-center">
        <slot name="center" />
      </div>
      <div v-if="divider" class="col-divider" />
      <div class="col-right">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  leftWidth: { type: String, default: '1fr' },
  centerWidth: { type: String, default: '1fr' },
  rightWidth: { type: String, default: '1fr' },
  divider: { type: Boolean, default: false },
})

const columnsStyle = computed(() => ({
  gridTemplateColumns: props.divider
    ? `${props.leftWidth} 1px ${props.centerWidth} 1px ${props.rightWidth}`
    : `${props.leftWidth} ${props.centerWidth} ${props.rightWidth}`,
}))
</script>

<style scoped>
.three-cols-layout {
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
  gap: 1rem;
}

.col-divider {
  width: 1px;
  height: 100%;
  background: var(--border-default, rgba(171, 178, 191, 0.15));
}
</style>
