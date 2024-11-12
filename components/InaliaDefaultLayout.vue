<script lang="ts" setup>
import type { DeepReadonly, PropType } from 'vue'
import type { Question } from '../types/question'
import InaliaQR from './InaliaQR.vue'
import InaliaShortUrl from './InaliaTinyUrl.vue'

defineProps({
  question: {
    type: Object as PropType<DeepReadonly<Question>>,
    required: true,
  },
})
</script>

<template>
  <div class="h-full w-full flex flex-row gap-8">
    <div class="grow flex flex-col">
      <h1>
        <slot name="title" :question="question">
          {{ question.question }}
        </slot>
      </h1>

      <slot />
    </div>

    <template v-if="question.tiny_url">
      <div class="flex flex-col space-y-4 items-end">
        <div
          class="inalia shrink-0 w-40 h-40 rounded-lg overflow-hidden"
        >
          <InaliaQR
            :url="question.tiny_url" class="block"
          />
        </div>
        <InaliaShortUrl :url="question.tiny_url" />
      </div>
    </template>
  </div>
</template>
