<template>
  <div class="slidev-layout end slide-title slide-dark slide-bare">
    <CenteredSlide :padding="padding" :content-max-width="contentMaxWidth">
      <slot />
      <!-- questions: a QR code to the deck (or `qr:`) and the contact links
           (the slide's `contact`, else the headmatter's) -->
      <div v-if="questions" class="end-questions">
        <QRCode v-if="qr !== false" :url="typeof qr === 'string' ? qr : ''" size="sm" :caption="qrCaption" />
        <div v-if="contact.length" class="end-contact">
          <a v-for="l in contact" :key="l.url" :href="l.url" target="_blank" rel="noopener" class="end-link" :class="`end-link-${l.kind}`">
            <span class="end-link-kind">{{ l.kind === 'web' ? 'web' : l.kind }}</span>
            <span>{{ l.label }}</span>
          </a>
        </div>
      </div>
    </CenteredSlide>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { configs, useSlideContext } from '@slidev/client'
import CenteredSlide from '../components/internal/CenteredSlide.vue'
import QRCode from '../components/QRCode.vue'
import { centeredLayoutProps } from '../utils/layout-props'
import { contactLinks } from '../utils/contact'
import { headmatterOf, isOn } from '../utils/frontmatter'

defineProps(centeredLayoutProps('48rem'))

// questions: true shows the panel; qr: false drops the code, a URL replaces
// the deck's; qrCaption under it
const { $frontmatter } = useSlideContext()
const headmatter = headmatterOf(configs)
const fm = computed(() => ($frontmatter ?? {}) as Record<string, any>)
const questions = computed(() => isOn(fm.value.questions))
const qr = computed(() => fm.value.qr ?? true)
const qrCaption = computed(() => String(fm.value.qrCaption ?? 'These slides'))
const contact = computed(() => contactLinks(fm.value.contact ?? headmatter.contact))
</script>

<style scoped>
/* Variables: --end-contact-color */
.end-questions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  margin-top: 2rem;
}

.end-contact {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  text-align: left;
}

.end-link {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  color: var(--end-contact-color, var(--text-primary));
  text-decoration: none;
  border: 0;
  font-size: 0.95rem;
}

.end-link:hover {
  color: var(--primary-300);
}

.end-link-kind {
  min-width: 4.5rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--primary-300);
}
</style>
