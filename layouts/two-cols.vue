<template>
  <div class="slidev-layout two-cols-layout">
    <slot />
    <div class="columns">
      <div class="col-left">
        <slot name="left" />
      </div>
      <div class="col-right">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  flex: 1;
}

.col-right {
  border-left: 2px solid rgba(139, 92, 246, 0.15);
  padding-left: 2rem;
}
</style>
