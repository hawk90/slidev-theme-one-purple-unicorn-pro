<template>
  <div class="slidev-layout full slide-bare">
    <slot />
  </div>
</template>

<style scoped>
/* Size, no padding and overflow come with every .slidev-layout (layout-fix.css)
   and slide-bare (no content padding) */
.full :deep(> *) {
  max-width: none;
}
</style>
