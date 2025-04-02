<script lang="ts" setup>
import type { FeedbackReaction } from '../../types/feedback-reaction'
import { onMounted, onUnmounted, ref } from 'vue'
import { fetchFeedbackReactions } from '../../utils/feedback-reactions'

const feedbackReactions = ref<FeedbackReaction[]>([])

onMounted(async () => {
  feedbackReactions.value = await fetchFeedbackReactions()

  window.Echo.private(`talks.${import.meta.env.VITE_INALIA_TALK_ID}`)
    .listen('FeedbackReactionCreated', (e: { feedback_reaction_id: number }) => {
      const feedbackReaction = feedbackReactions.value.find(
        reaction => reaction.id === e.feedback_reaction_id,
      )

      if (!feedbackReaction) {
        return
      }

      feedbackReaction.feedback_reactions_count = (feedbackReaction.feedback_reactions_count ?? 0) + 1
    })
})
onUnmounted(() => {
  window.Echo.leave(`talks.${import.meta.env.VITE_INALIA_TALK_ID}`)
})
</script>

<template>
  <div>
    <h2 class="text-base font-semibold">
      Feedback Reactions
    </h2>
    <ol class="mt-4 text-base list-decimal list-inside">
      <li v-for="reaction in feedbackReactions" :key="reaction.id">
        {{ reaction.feedback_reactions_count }} {{ reaction.feedback_reactions_count! > 1 ? 'reactions' : 'reaction' }} for {{ reaction.emoji }} {{ reaction.description }}
      </li>
    </ol>
  </div>
</template>
