<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { useInaliaAudienceQuestionHighlighted } from '../composables/useInaliaAudienceQuestionHighlighted'

const { audienceQuestion, listen, dispose } = useInaliaAudienceQuestionHighlighted()

onMounted(() => {
  listen()
})
onUnmounted(() => {
  dispose()
})
</script>

<template>
  <div v-if="audienceQuestion" class="flex items-center justify-center">
    <div class="absolute z-10 inset-0 bg-white/60 backdrop-blur-sm" />

    <div class="relative z-10 p-4 bg-white rounded-lg shadow-lg max-w-xl border border-gray-200">
      {{ audienceQuestion?.question }}
    </div>
  </div>
</template>
