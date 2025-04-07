<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { useInaliaAudienceQuestions } from '../composables/useInaliaAudienceAuestions'
import { useInaliaTalk } from '../composables/useInaliaTalk'

const { talk } = useInaliaTalk()
const { audienceQuestions, fetch, listen, dispose } = useInaliaAudienceQuestions()

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

  <div v-else-if="audienceQuestions" class="p-4">
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
    <span>
      No audience questions available.
    </span>
  </div>
</template>
