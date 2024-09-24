<script lang="ts" setup generic="T extends QuestionType">
import type { Answer } from '../types/answer'
import type { ChartType, QuestionType } from '../types/question'
import InaliaAnswersText from '../components/InaliaAnswersText.vue'
import { useInalia } from '../composables/useInalia'
import InaliaAnswersSingleSelect from './InaliaAnswersSingleSelect.vue'
import InaliaDefaultLayout from './InaliaDefaultLayout.vue'
import InaliaLegend from './InaliaLegend.vue'
import InaliaLoading from './InaliaLoading.vue'

const props = withDefaults(defineProps<{
  questionId?: number
  question?: string
  type?: T
  chart?: T extends 'text' ? never : ChartType
  answers?: Answer<T>[]
}>(), { questionId: 0 })

const { isStatic, question, answers, answerUrl } = useInalia(() => props.questionId, {
  staticContent: {
    question: () => props.question,
    type: () => props.type,
    chart: () => props.chart,
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
          v-if="
            question.type === 'text'
              && answers
          "
          class="overflow-auto"
          :answers="answers"
        />

        <InaliaAnswersSingleSelect
          v-else-if="
            question.type === 'single_select'
              && question.chartType
              && answers
          "
          :answers="answers"
          :chart="question.chartType"
          class="h-full mb-10"
        />

        <InaliaLegend
          v-if="
            question.type === 'single_select'
              && answers
          "
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
