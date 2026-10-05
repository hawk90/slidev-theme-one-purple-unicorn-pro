<template>
  <ColumnsLayout
    layout-class="two-cols-layout"
    :count="2"
    :widths="[leftWidth, rightWidth]"
    :divider="divider"
    :labels="[leftLabel, rightLabel]"
    :label-colors="[leftLabelColor, rightLabelColor]"
  >
    <template v-for="(_, name) in $slots" :key="name" #[name]>
      <slot :name="name" />
    </template>
  </ColumnsLayout>
</template>

<script setup lang="ts">
import ColumnsLayout from '../components/internal/ColumnsLayout.vue'

defineProps({
  leftWidth: { type: String, default: '1fr' },
  rightWidth: { type: String, default: '1fr' },
  divider: { type: Boolean, default: false },
  leftLabel: { type: String, default: '' },
  rightLabel: { type: String, default: '' },
  leftLabelColor: { type: String, default: '' },
  rightLabelColor: { type: String, default: '' },
})
</script>
