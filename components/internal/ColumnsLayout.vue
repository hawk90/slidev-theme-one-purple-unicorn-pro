<template>
  <div class="slidev-layout columns-layout" :class="layoutClass">
    <div class="col-header">
      <slot />
    </div>
    <GridColumns
      :count="count"
      :widths="widths"
      :divider="divider"
      :labels="labels"
      :label-colors="labelColors"
    >
      <template v-for="name in ['left', 'center', 'right']" :key="name" #[name]>
        <slot :name="name" />
      </template>
    </GridColumns>
    <div class="col-bottom">
      <slot name="bottom" />
    </div>
  </div>
</template>

<script setup lang="ts">
import GridColumns from './GridColumns.vue'

// Shared by the two-cols and three-cols layouts: header (default slot),
// columns (left / center / right slots) and a full-width bottom slot
defineProps({
  layoutClass: { type: String, required: true },
  count: { type: Number, required: true },
  widths: { type: Array as () => string[], default: () => [] },
  divider: { type: Boolean, default: false },
  labels: { type: Array as () => string[], default: () => [] },
  labelColors: { type: Array as () => string[], default: () => [] },
})
</script>

<style scoped>
.columns-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.col-header,
.col-bottom {
  flex-shrink: 0;
}
</style>
