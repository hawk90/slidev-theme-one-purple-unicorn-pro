<template>
  <div class="slidev-layout cover slide-title slide-dark slide-bare">
    <CenteredSlide dark :padding="padding" :content-max-width="contentMaxWidth">
      <slot />
      <!-- The talk's details from the headmatter (utils/talk-info.ts) -->
      <div v-if="info" class="cover-info">
        <div v-if="info.people.length" class="cover-people">
          <span v-for="p in info.people" :key="p.name" class="cover-person">
            <span class="cover-name">{{ p.name }}</span>
            <span v-if="p.affiliation" class="cover-person-affiliation">{{ p.affiliation }}</span>
          </span>
        </div>
        <div v-if="info.affiliation" class="cover-affiliation">{{ info.affiliation }}</div>
        <div v-if="info.parts.length" class="cover-meta">{{ info.parts.join(' · ') }}</div>
        <img v-if="info.logo" :src="resolveAssetUrl(info.logo)" alt="" class="cover-logo" />
      </div>
    </CenteredSlide>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveAssetUrl, useNav, useSlideContext } from '@slidev/client'
import CenteredSlide from '../components/internal/CenteredSlide.vue'
import { centeredLayoutProps } from '../utils/layout-props'
import { coverInfo } from '../utils/talk-info'

defineProps(centeredLayoutProps('48rem'))

const { $frontmatter, $page } = useSlideContext()
const { slides } = useNav()
const info = computed(() => coverInfo(
  $frontmatter ?? {}, // a reactive object, not a ref
  slides.value[0]?.meta?.slide?.frontmatter ?? {},
  $page.value === 1,
))
</script>

<style scoped>
/* Theme variables: --cover-info-color, --cover-info-muted, --cover-logo-height */
.cover-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  margin-top: 2.5rem;
  color: var(--cover-info-color, var(--text-bright));
}

/* A short brand line between the title block and the details */
.cover-info::before {
  content: '';
  width: 3rem;
  height: 2px;
  margin-bottom: 1rem;
  border-radius: 1px;
  background: var(--gradient-primary);
}

.cover-people {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem 2rem;
}

.cover-person {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cover-name {
  font-size: 1.1rem;
  font-weight: 600;
}

.cover-person-affiliation,
.cover-affiliation {
  font-size: 0.85rem;
  color: var(--cover-info-muted, var(--text-secondary));
}

.cover-meta {
  font-size: 0.8rem;
  letter-spacing: 0.03em;
  color: var(--cover-info-muted, var(--text-muted));
}

.cover-logo {
  height: var(--cover-logo-height, 2rem);
  width: auto;
  margin-top: 1rem;
}
</style>
