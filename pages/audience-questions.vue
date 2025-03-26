<script lang="ts" setup>
import type { AudienceQuestion } from '../types/audience-question'
import { onMounted, onUnmounted, ref } from 'vue'
import { useInaliaTalk } from '../composables/useInaliaTalk'
import { fetchAudienceQuestions } from '../utils/audience-questions'

const { talk } = useInaliaTalk()

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
  <div v-if="talk" class="p-4">
    <h1 class="text-lg font-bold">
      Audience Questions for {{ talk?.title }}
    </h1>
    <ol class="mt-4 text-base list-decimal list-inside">
      <li v-for="question in audienceQuestions" :key="question.question">
        {{ question.question }}
      </li>
    </ol>
  </div>
  <div v-else>
    <span>Loading...</span>
  </div>
</template>
