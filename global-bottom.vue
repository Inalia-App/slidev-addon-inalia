<script lang="ts" setup>
import InaliaAudienceQuestionHighlighted from './components/InaliaAudienceQuestionHighlighted.vue'
import InaliaLiveReactions from './components/InaliaLiveReactions.vue'
import InaliaRunToContinue from './components/InaliaRunToContinue.vue'
import { useInaliaTalk } from './composables/useInaliaTalk'

const { talk, run } = useInaliaTalk()
</script>

<template>
  <InaliaLiveReactions class="w-full h-full relative" />
  <InaliaAudienceQuestionHighlighted class="absolute inset-0" />
  <InaliaRunToContinue v-if="talk?.slidev.run_to_continue" class="absolute z-10 bottom-0 inset-x-0" @run="run" />
</template>
