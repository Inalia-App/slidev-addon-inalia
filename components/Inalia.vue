<script lang="ts">
import type { Data, SelectData, TextData } from '../types/data'
import type { ChartType, QuestionType } from '../types/question'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useInaliaQuestion } from '../composables/useInaliaQuestion'
import InaliaDefaultLayout from './InaliaDefaultLayout.vue'
import InaliaLegend from './InaliaLegend.vue'
import InaliaLoading from './InaliaLoading.vue'
import InaliaSelect from './InaliaSelect.vue'
import InaliaText from './InaliaText.vue'

const inalia = tv({
  slots: {
    base: '',
    textData: 'inalia overflow-auto inalia-data-text',
    selectData: 'inalia h-full inalia-data-select',
    legend: '',
  },
})

export interface InaliaProps {
  questionId?: number
  question?: string
  type?: QuestionType
  chart?: ChartType
  data?: Data
  class?: any
  ui?: Partial<typeof inalia.slots>
}
export interface InaliaEmits {}
export interface InaliaSlots {
  default?: (props: { isStatic: boolean, question: any, data: any }) => any
}
</script>

<script lang="ts" setup>
const props = withDefaults(defineProps<InaliaProps>(), { questionId: 0 })
defineEmits<InaliaEmits>()
defineSlots<InaliaSlots>()

const { isStatic, question, data } = useInaliaQuestion(() => props.questionId, {
  staticContent: {
    question: () => props.question,
    type: () => props.type,
    chart: () => props.chart,
    data: () => props.data,
  },
})

const ui = computed(() => inalia())
</script>

<template>
  <template v-if="question">
    <InaliaDefaultLayout
      :question="question.question"
      :url="question.tiny_url"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
    >
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
          :class="ui.textData({ class: props.ui?.textData })"
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
          :class="ui.selectData({ class: props.ui?.selectData })"
        />

        <InaliaLegend
          v-if="
            (question.type === 'single_select'
              || question.type === 'multiple_select')
              && data
          "
          :data="data as SelectData"
          :class="ui.legend({ class: props.ui?.legend })"
        />
      </slot>
    </InaliaDefaultLayout>
  </template>
  <template v-else>
    <InaliaLoading />
  </template>
</template>
