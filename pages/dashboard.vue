<script lang="ts" setup>
import AudienceQuestions from '../components/internals/AudienceQuestions.vue'
import FeedbackReactions from '../components/internals/FeedbackReactions.vue'
import { useInaliaTalk } from '../composables/useInaliaTalk'

const { talk } = useInaliaTalk()
</script>

<template>
  <div class="p-4 space-y-4">
    <template v-if="talk">
      <h1 class="text-lg font-bold">
        {{ talk.title }}
      </h1>

      <AudienceQuestions />

      <FeedbackReactions />

      <FeedbackMessages />
    </template>
    <template v-else>
      <p class="">
        Loading...
      </p>
    </template>
  </div>
</template>
