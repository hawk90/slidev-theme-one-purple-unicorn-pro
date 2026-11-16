<template>
  <!-- A person: avatar (or initials), name, role and affiliation, and links -->
  <div class="person" :class="`person-${size}`">
    <img v-if="avatar" :src="resolveAssetUrl(avatar)" alt="" class="person-avatar" />
    <div v-else class="person-avatar person-initials" aria-hidden="true">{{ initials }}</div>
    <div class="person-text">
      <div class="person-name">{{ name }}</div>
      <div v-if="role" class="person-role">{{ role }}</div>
      <div v-if="affiliation" class="person-affiliation">{{ affiliation }}</div>
      <div v-if="contact.length" class="person-links">
        <a v-for="l in contact" :key="l.url" :href="l.url" target="_blank" rel="noopener" class="person-link" :class="`person-link-${l.kind}`">{{ l.label }}</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveAssetUrl } from '@slidev/client'
import { contactLinks } from '../utils/contact'

const props = defineProps({
  name: { type: String, required: true },
  role: { type: String, default: '' },
  affiliation: { type: String, default: '' },
  /** An image path (public/ or a URL); without it, the initials */
  avatar: { type: String, default: '' },
  /** URLs, e-mail addresses, { label, url } or { github: name } (utils/contact.ts) */
  links: { type: [Array, String, Object], default: () => [] },
  /** sm | md (default) | lg */
  size: { type: String, default: 'md' },
})

const contact = computed(() => contactLinks(props.links))
const initials = computed(() => props.name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => [...w][0]).join('').toUpperCase())
</script>

<style scoped>
/* Variables: --person-avatar-size, --person-accent */
.person {
  --_size: var(--person-avatar-size, 4rem);
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
}
.person-sm { --_size: var(--person-avatar-size, 2.75rem); }
.person-lg { --_size: var(--person-avatar-size, 7rem); gap: 1.5rem; }

.person-avatar {
  flex: none;
  width: var(--_size);
  height: var(--_size);
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--person-accent, var(--primary-400));
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--person-accent, var(--primary-400)) 18%, transparent);
}

.person-initials {
  display: grid;
  place-items: center;
  background: var(--gradient-primary);
  color: #fff;
  font-weight: 700;
  font-size: calc(var(--_size) * 0.36);
}

.person-name {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--text-primary);
}
.person-lg .person-name { font-size: 1.5rem; }

.person-role {
  color: var(--person-accent, var(--primary-400));
  font-size: 0.85rem;
  font-weight: 600;
}

.person-affiliation {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.person-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.75rem;
  margin-top: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
}

.person-link {
  color: var(--text-secondary);
  text-decoration: none;
  border: 0;
}
.person-link:hover { color: var(--person-accent, var(--primary-400)); }
.person-link::before { content: '↗ '; opacity: 0.6; }
.person-link-email::before { content: '✉ '; }
</style>
