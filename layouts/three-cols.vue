<template>
  <ColumnsLayout
    layout-class="three-cols-layout"
    :count="3"
    :widths="[leftWidth, centerWidth, rightWidth]"
    :divider="divider"
    :labels="[leftLabel, centerLabel, rightLabel]"
    :label-colors="[leftLabelColor, centerLabelColor, rightLabelColor]"
  >
    <template v-for="(_, name) in $slots" :key="name" #[name]>
      <slot :name="name" />
    </template>
  </ColumnsLayout>
</template>

<script setup lang="ts">
import ColumnsLayout from '../components/internal/ColumnsLayout.vue'

defineProps({
  leftWidth: { type: [String, Number], default: '1fr' },
  centerWidth: { type: [String, Number], default: '1fr' },
  rightWidth: { type: [String, Number], default: '1fr' },
  divider: { type: Boolean, default: false },
  leftLabel: { type: String, default: '' },
  centerLabel: { type: String, default: '' },
  rightLabel: { type: String, default: '' },
  leftLabelColor: { type: String, default: '' },
  centerLabelColor: { type: String, default: '' },
  rightLabelColor: { type: String, default: '' },
})
</script>
