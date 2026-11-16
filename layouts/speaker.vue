<template>
  <!-- About the speaker: the person on the left, the slide's text (a short
       bio, topics) on the right. From the slide's `speaker:` (name, role,
       affiliation, avatar, links), else the headmatter's, else its author and
       affiliation. (Not a top-level `name:`: Slidev takes that as the slide's
       title.) -->
  <div class="slidev-layout speaker">
    <div class="speaker-person">
      <Person v-if="person.name" v-bind="person" size="lg" />
    </div>
    <div class="speaker-bio">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { configs, useSlideContext } from '@slidev/client'
import Person from '../components/Person.vue'
import { headmatterOf } from '../utils/frontmatter'

const { $frontmatter } = useSlideContext()
const headmatter = headmatterOf(configs)

const person = computed(() => {
  const obj = (v: unknown) => (v && typeof v === 'object' ? v : {}) as Record<string, any>
  const own = obj((($frontmatter ?? {}) as Record<string, any>).speaker)
  const deck = obj(headmatter.speaker)
  const pick = (k: string) => own[k] ?? deck[k]
  return {
    name: String(pick('name') ?? headmatter.author ?? ''),
    role: String(pick('role') ?? ''),
    affiliation: String(pick('affiliation') ?? headmatter.affiliation ?? ''),
    avatar: String(pick('avatar') ?? ''),
    links: pick('links') ?? [],
  }
})
</script>

<style scoped>
.speaker {
  display: grid;
  grid-template-columns: minmax(16rem, 2fr) 3fr;
  align-items: center;
  gap: 3rem;
}

.speaker-person {
  justify-self: end;
}

.speaker-bio {
  border-left: 2px solid color-mix(in srgb, var(--primary-400) 40%, transparent);
  padding-left: 2rem;
}
</style>
