<script lang="ts" setup>
import { configs, useNav } from '@slidev/client'
import { computed } from 'vue'
import InaliaAudienceQuestionHighlighted from './components/InaliaAudienceQuestionHighlighted.vue'
import InaliaLiveReactions from './components/InaliaLiveReactions.vue'
import InaliaRunToContinue from './components/InaliaRunToContinue.vue'
import { useInaliaTalk } from './composables/useInaliaTalk'

const { talk, run } = useInaliaTalk()
const { currentSlideRoute } = useNav()

const isEmojiDisabled = computed(() => (currentSlideRoute.value.meta.slide as any).frontmatter?.inalia?.emoji === false)
const emojiConfig = computed(() => (configs as any).inalia?.emoji)
const emojiLimit = computed(() => typeof emojiConfig.value === 'object' && emojiConfig.value !== null ? emojiConfig.value.limit : undefined)
</script>

<template>
  <InaliaLiveReactions :disabled="isEmojiDisabled" :max-emojis="emojiLimit" class="w-full h-full relative" />
  <InaliaAudienceQuestionHighlighted class="absolute inset-0" />
  <InaliaRunToContinue v-if="talk?.slidev.run_to_continue" class="absolute z-10 bottom-0 inset-x-0" @run="run" />
</template>
