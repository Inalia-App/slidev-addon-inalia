<script lang="ts" setup generic="Q extends Question">
import type { PropType } from 'vue'
import type { StaticAnswer } from '../types/answer'
import type { Question, StaticQuestion } from '../types/question'
import InaliaAnswersText from '../components/InaliaAnswersText.vue'
import InaliaQR from '../components/InaliaQR.vue'
import { useInalia } from '../composables/useInalia'

const props = defineProps({
  questionId: {
    type: Number,
    default: 0,
  },
  question: {
    type: Object as PropType<StaticQuestion<Q['type']>>,
  },
  answers: {
    type: Array as PropType<StaticAnswer<Q['type']>[]>,
  },
})

const { isStatic, question, answers, answerUrl } = useInalia(() => props.questionId, {
  staticContent: {
    question: () => props.question,
    answers: () => props.answers,
  },
})
</script>

<template>
  <template v-if="question">
    <div class="h-full flex flex-row justify-between gap-8">
      <div class="flex flex-col">
        <h1>
          <slot name="title" :question="question">
            {{ question.question }}
          </slot>
        </h1>

        <InaliaAnswersText v-if="question.type === 'text' && answers" :answers="answers" class="overflow-auto" />
      </div>

      <div
        class="inalia shrink-0 w-40 h-40 rounded-lg overflow-hidden"
      >
        <InaliaQR
          v-if="!isStatic"
          :url="answerUrl" class="block"
        />
      </div>
    </div>
  </template>
  <template v-else>
    <p>Loading...</p>
  </template>
</template>
