<script lang="ts" setup>
import type { AudienceQuestion } from '../../types/audience-question'
import { onMounted, onUnmounted, ref } from 'vue'
import { fetchAudienceQuestions } from '../../utils/audience-questions'

const audienceQuestions = ref<AudienceQuestion[]>([])

onMounted(async () => {
  audienceQuestions.value = await fetchAudienceQuestions()

  window.Echo.private(`talks.${import.meta.env.VITE_INALIA_TALK_ID}`)
    .listen('AudienceQuestionCreated', (e: AudienceQuestion) => {
      audienceQuestions.value.push(e)
    })
})

onUnmounted(() => {
  window.Echo.leave(`talks.${import.meta.env.VITE_INALIA_TALK_ID}`)
})
</script>

<template>
  <div>
    <h2 class="text-base font-semibold">
      Audience Questions
    </h2>
    <ol class="mt-4 text-base list-decimal list-inside">
      <li v-for="question in audienceQuestions" :key="question.question">
        {{ question.question }}
      </li>
    </ol>
  </div>
</template>
