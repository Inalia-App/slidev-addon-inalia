<script lang="ts" setup>
import type { FeedbackMessage } from '../../types/feedback-message'
import { onMounted, onUnmounted, ref } from 'vue'
import { fetchFeedbackMessages } from '../../utils/feedback-messages'

const feedbackMessages = ref<FeedbackMessage[]>([])

onMounted(async () => {
  feedbackMessages.value = await fetchFeedbackMessages()

  window.Echo.private(`talks.${import.meta.env.VITE_INALIA_TALK_ID}`)
    .listen('FeedbackMessageCreated', (e: FeedbackMessage) => {
      feedbackMessages.value.push(e)
    })
})

onUnmounted(() => {
  window.Echo.leave(`talks.${import.meta.env.VITE_INALIA_TALK_ID}`)
})
</script>

<template>
  <div>
    <h2 class="text-base font-semibold">
      Feedback Messages
    </h2>
    <ol class="mt-4 text-base list-decimal list-inside">
      <li v-for="message in feedbackMessages" :key="message.message">
        {{ message.message }}
      </li>
    </ol>
  </div>
</template>
