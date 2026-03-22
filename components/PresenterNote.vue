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

/* Only visible in presenter mode or when explicitly shown */
.slidev-page.presenter .presenter-note,
.presenter-note.show {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(198, 120, 221, 0.06);
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

@media print {
  .presenter-note {
    display: none !important;
  }
}
</style>
