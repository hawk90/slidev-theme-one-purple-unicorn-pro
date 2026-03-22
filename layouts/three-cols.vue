<template>
  <div class="slidev-layout three-cols-layout">
    <div class="col-header">
      <slot />
    </div>
    <div class="columns" :style="columnsStyle">
      <div class="col-left">
        <slot name="left" />
      </div>
      <div class="col-center">
        <slot name="center" />
      </div>
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
})

const columnsStyle = computed(() => ({
  gridTemplateColumns: `${props.leftWidth} ${props.centerWidth} ${props.rightWidth}`,
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
</style>
