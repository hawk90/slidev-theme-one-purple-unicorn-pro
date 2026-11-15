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
import { columnLayoutProps } from '../utils/layout-props'

defineProps(columnLayoutProps(['left', 'center', 'right']))
</script>
