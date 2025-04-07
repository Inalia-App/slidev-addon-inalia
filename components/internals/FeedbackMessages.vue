<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { useInaliaFeedbackMessages } from '../../composables/useInaliaFeedbackMessages'
import { useInaliaTalk } from '../../composables/useInaliaTalk'

const { talk } = useInaliaTalk()
const { feedbackMessages, fetch, listen, dispose } = useInaliaFeedbackMessages()

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

  <div v-else-if="feedbackMessages">
    <h2 class="text-base font-semibold">
      Feedback Messages
    </h2>
    <ol class="mt-4 text-base list-decimal list-inside">
      <li v-for="message in feedbackMessages" :key="message.message">
        {{ message.message }}
      </li>
    </ol>
  </div>

  <div v-else>
    <span>
      No feedback messages available.
    </span>
  </div>
</template>
