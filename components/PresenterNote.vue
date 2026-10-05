<template>
  <div class="presenter-note">
    <div class="pn-icon">📝</div>
    <div class="pn-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.presenter-note {
  display: none;
}

/* Only visible in the presenter view (.slidev-presenter) or with class="show" */
.slidev-presenter .presenter-note,
.presenter-note.show {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: color-mix(in srgb, var(--primary-400) 6%, transparent);
  border: 1px dashed var(--primary-700, #5c3d8f);
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  font-size: 0.75rem;
  color: var(--text-muted, #5c6370);
}

.pn-icon {
  flex-shrink: 0;
  font-size: 0.85rem;
}

.pn-body :deep(p) {
  font-size: 0.75rem;
  margin: 0;
}
</style>

<style>
/* Not in PDF/PNG exports or printouts (html.print-mode, utils/print-export.ts) */
.print-mode .presenter-note { display: none !important; }
</style>
