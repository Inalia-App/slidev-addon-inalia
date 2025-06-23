<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { useInaliaAudienceQuestionHighlighted } from '../composables/useInaliaAudienceQuestionHighlighted'

const { audienceQuestion, clearAudienceQuestion, listen, dispose } = useInaliaAudienceQuestionHighlighted()

onMounted(() => {
  listen()
})
onUnmounted(() => {
  dispose()
})

const target = useTemplateRef<HTMLElement>('target')
onClickOutside(target, clearAudienceQuestion)
</script>

<template>
  <div v-if="audienceQuestion" class="flex items-center justify-center">
    <div class="absolute z-10 inset-0 bg-white/60 backdrop-blur-sm" />

    <div ref="target" class="z-10 relative p-4 bg-white rounded-lg shadow-lg min-w-lg max-w-xl border border-gray-200 text-xl">
      {{ audienceQuestion?.question }}

      <div class="text-right text-gray-500 italic mt-2">
        Anonymous
      </div>
    </div>
  </div>
</template>
