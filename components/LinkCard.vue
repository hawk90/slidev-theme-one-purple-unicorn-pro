<template>
  <a :href="href" target="_blank" rel="noopener noreferrer" class="link-card" :class="{ 'link-card-compact': compact }">
    <div class="link-icon">{{ icon }}</div>
    <div class="link-body">
      <div class="link-title">{{ title }}</div>
      <div v-if="description" class="link-desc">{{ description }}</div>
    </div>
    <div class="link-arrow">→</div>
  </a>
</template>

<script setup lang="ts">
defineProps({
  href: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '🔗' },
  compact: { type: Boolean, default: false },
})
</script>

<style scoped>
.link-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid color-mix(in srgb, var(--text-primary) 22%, transparent);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-base);
  margin: 0.5rem 0;
}

.link-card::after {
  display: none;
}

.link-card:hover {
  border-color: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.link-card-compact {
  padding: 0.5rem 0.75rem;
}

.link-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.link-card-compact .link-icon {
  font-size: 1rem;
}

.link-body {
  flex: 1;
  min-width: 0;
}

.link-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-bright);
}

.link-card-compact .link-title {
  font-size: 0.75rem;
}

.link-desc {
  font-size: 0.7rem;
  color: var(--text-secondary);
  margin-top: 0.15rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-arrow {
  font-size: 0.85rem;
  /* 300: lighter in dark mode, deeper in light mode (400 was 4.36:1 on the
     dark card) */
  color: var(--primary-300);
  flex-shrink: 0;
  transition: transform var(--transition-base), color var(--transition-base);
}

.link-card:hover .link-arrow {
  transform: translateX(3px);
}
</style>
