<script lang="ts" setup>
import type { DeepReadonly, PropType } from 'vue'
import type { Question } from '../types/question'
import InaliaQR from './InaliaQR.vue'
import InaliaShortUrl from './InaliaShortUrl.vue'

defineProps({
  question: {
    type: Object as PropType<DeepReadonly<Question>>,
    required: true,
  },
})
</script>

<template>
  <div class="h-full flex w-full flex-row gap-8">
    <div class="flex flex-col grow">
      <h1>
        <slot name="title" :question="question">
          {{ question.question }}
        </slot>
      </h1>

      <slot />
    </div>

    <template v-if="question.tiny_url">
      <div class="flex flex-col space-y-2 items-end">
        <div
          class="inalia rounded-lg shrink-0 overflow-hidden w-40 h-40"
        >
          <InaliaQR
            :url="question.tiny_url" class="block"
          />
        </div>
        <InaliaShortUrl :url="question.tiny_url" class="border-0! text-xs mx-auto" />
      </div>
    </template>

    <div class="absolute op-40 bottom-2 left-1/2 -translate-x-1/2">
      <InaliaPoweredBy />
    </div>
  </div>
</template>
