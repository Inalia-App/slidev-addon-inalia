<script lang="ts" setup>
import type { ChartType, Data, QuestionType, SelectData, TextData } from '../types'
import { useInalia } from '../composables/useInalia'
import InaliaDefaultLayout from './InaliaDefaultLayout.vue'
import InaliaLegend from './InaliaLegend.vue'
import InaliaLoading from './InaliaLoading.vue'
import InaliaSelect from './InaliaSelect.vue'
import InaliaText from './InaliaText.vue'

const props = withDefaults(defineProps<{
  questionId?: number
  question?: string
  type?: QuestionType
  chart?: ChartType
  data?: Data // TODO: dynamic types depending on question type
}>(), { questionId: 0 })

const { isStatic, question, data } = useInalia(() => props.questionId, {
  staticContent: {
    question: () => props.question,
    type: () => props.type,
    chart: () => props.chart,
    data: () => props.data,
  },
})
</script>

<template>
  <template v-if="question">
    <InaliaDefaultLayout :question="question">
      <slot
        :is-static="isStatic"
        :question="question"
        :data="data"
      >
        <InaliaText
          v-if="
            question.type === 'text'
              && data
          "
          class="inalia overflow-auto inalia-data-text"
          :data="data as TextData"
        />

        <InaliaSelect
          v-else-if="
            (question.type === 'single_select'
              || question.type === 'multiple_select')
              && data
          "
          :data="data as SelectData"
          :chart="question.options.chart_type"
          class="inalia h-full inalia-data-select"
        />

        <InaliaLegend
          v-if="
            (question.type === 'single_select'
              || question.type === 'multiple_select')
              && data
          "
          :data="data as SelectData"
        />
      </slot>
    </InaliaDefaultLayout>
  </template>
  <template v-else>
    <InaliaLoading />
  </template>
</template>
