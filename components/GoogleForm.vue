<template>
  <!-- A quiz or poll on Google Forms: a QR code and a short link so the room
       opens it on their phones, the form itself beside it (`embed`), and the
       results from a published Google Sheet chart (`results`). Exports show
       the QR code and the link instead of the live frames. -->
  <div class="gform" :class="{ 'gform-wide': showFrame }">
    <div class="gform-join">
      <QRCode :url="formUrl" :size="qrSize" />
      <a class="gform-link" :href="formUrl" target="_blank" rel="noopener">{{ shortLink }}</a>
      <div v-if="prompt" class="gform-prompt">{{ prompt }}</div>
    </div>
    <iframe v-if="showFrame" :src="frameUrl" :title="title || 'Google Form'" class="gform-frame" loading="lazy" />
    <div v-else-if="printing && (embed || results)" class="gform-print">
      {{ results ? 'Results: live in the presentation' : 'Form: open the link or scan the code' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import QRCode from './QRCode.vue'
import { formEmbedUrl, formShortLink } from '../utils/google-form'

const props = defineProps({
  /** The form's address (its "Send" link: docs.google.com/forms/d/e/…/viewform, or forms.gle/…) */
  url: { type: String, required: true },
  /** Show the form beside the code */
  embed: { type: Boolean, default: false },
  /** A published Sheet chart's address (File → Share → Publish to web → the chart, embed): shown instead of the form */
  results: { type: String, default: '' },
  /** The link under the code, if not the form's own */
  link: { type: String, default: '' },
  prompt: { type: String, default: '' },
  title: { type: String, default: '' },
  qrSize: { type: String, default: 'lg' },
})

const { isPrintMode } = useNav()
const printing = computed(() => isPrintMode.value)
const formUrl = computed(() => props.url)
const shortLink = computed(() => props.link || formShortLink(props.url))
const frameUrl = computed(() => props.results || formEmbedUrl(props.url))
const showFrame = computed(() => !printing.value && (props.embed || !!props.results))
</script>

<style scoped>
.gform {
  display: grid;
  grid-template-columns: auto;
  justify-content: center;
  gap: 2rem;
  align-items: center;
  margin: 0.5rem 0;
}

.gform-wide {
  grid-template-columns: auto 1fr;
}

.gform-join {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.gform-link {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary-400);
  text-decoration: none;
  border: 0;
}

.gform-prompt {
  max-width: 14rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.gform-frame {
  width: 100%;
  height: var(--gform-height, 22rem);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  background: #fff;
}

.gform-print {
  padding: 2rem;
  border: 1px dashed var(--border-default);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
}
</style>
