<script lang="ts" setup generic="Q extends Question">
import type { PropType } from 'vue'
import type { StaticAnswer } from '../types/answer'
import type { Question, StaticQuestion } from '../types/question'
import InaliaAnswersText from '../components/InaliaAnswersText.vue'
import { useInalia } from '../composables/useInalia'
import InaliaAnswersSingleSelect from './InaliaAnswersSingleSelect.vue'
import InaliaDefaultLayout from './InaliaDefaultLayout.vue'
import InaliaLegend from './InaliaLegend.vue'
import InaliaLoading from './InaliaLoading.vue'

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
    <InaliaDefaultLayout :question="question" :url="isStatic ? undefined : answerUrl">
      <slot
        :is-static="isStatic"
        :question="question"
        :answers="answers"
      >
        <InaliaAnswersText
          v-if="question.type === 'text' && answers"
          class="overflow-auto"
          :answers="answers"
        />

        <InaliaAnswersSingleSelect
          v-else-if="question.type === 'single_select' && answers"
          :answers="answers"
          class="h-full mb-10"
        />

        <InaliaLegend
          v-if="question.type === 'single_select' && answers"
          class="absolute bottom-10 left-14 right-14"
          :answers="answers"
        />
      </slot>
    </InaliaDefaultLayout>
  </template>
  <template v-else>
    <InaliaLoading />
  </template>
</template>
