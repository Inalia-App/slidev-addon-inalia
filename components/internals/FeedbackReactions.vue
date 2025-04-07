<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { useInaliaFeedbackReactions } from '../../composables/useInaliaFeedbackReactions'
import { useInaliaTalk } from '../../composables/useInaliaTalk'

const { talk } = useInaliaTalk()
const { feedbackReactions, fetch, listen, dispose } = useInaliaFeedbackReactions()

onMounted(async () => {
  await fetch()

  listen()
})

onUnmounted(() => {
  dispose()
})
</script>

<template>
  <div v-if="!talk">
    <span>
      Inalia is running in static mode.
    </span>
  </div>

  <div v-else-if="feedbackReactions">
    <h2 class="text-base font-semibold">
      Feedback Reactions
    </h2>
    <ol class="text-base mt-4 list-decimal list-inside">
      <li v-for="reaction in feedbackReactions" :key="reaction.id">
        {{ reaction.feedback_reactions_count }} {{ reaction.feedback_reactions_count! > 1 ? 'reactions' : 'reaction' }} for {{ reaction.emoji }} {{ reaction.description }}
      </li>
    </ol>
  </div>

  <div v-else>
    <span>
      No feedback reactions available.
    </span>
  </div>
</template>
