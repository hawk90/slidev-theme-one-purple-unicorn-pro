<template>
  <div class="slidev-layout full-center">
    <div class="full-center-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.full-center {
  width: 100%;
  height: 100%;
  padding: 0 !important;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.full-center-content {
  text-align: center;
  max-width: 64rem;
  padding: 2rem;
}

.full-center :deep(> *) {
  max-width: none;
}
</style>
