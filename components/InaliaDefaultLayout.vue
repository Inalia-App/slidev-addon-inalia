<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Question } from '../types/question'
import InaliaQR from './InaliaQR.vue'

defineProps({
  question: {
    type: Object as PropType<Question>,
    required: true,
  },
  url: {
    type: String,
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

    <div
      class="inalia shrink-0 w-40 h-40 rounded-lg overflow-hidden"
    >
      <InaliaQR
        v-if="url"
        :url="url" class="block"
      />
    </div>
  </div>
</template>
