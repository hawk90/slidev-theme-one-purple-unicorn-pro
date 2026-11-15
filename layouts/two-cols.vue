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
import { columnLayoutProps } from '../utils/layout-props'

defineProps(columnLayoutProps(['left', 'right']))
</script>
