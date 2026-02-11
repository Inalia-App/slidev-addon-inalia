<script lang="ts">
import type { Data } from '../../types/data'
import type { QuestionType } from '../../types/lite/question'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useInaliaLiteQuestion } from '../../composables/lite/useInaliaLiteQuestion'
import { createAnswersCreateUrl } from '../../utils/lite/urls'
import InaliaDefaultLayout from '../InaliaDefaultLayout.vue'
import InaliaLoading from '../InaliaLoading.vue'
import InaliaSelect from '../InaliaSelect.vue'
import InaliaText from '../InaliaText.vue'

const inaliaLite = tv({
  slots: {
    base: '',
    textData: 'inalia overflow-auto inalia-data-text',
    selectData: 'inalia h-full inalia-data-select',
    legend: '',
  },
})

export interface InaliaLiteProps {
  questionId?: number
  question?: string
  type?: QuestionType
  data?: Data
  class?: any
  ui?: Partial<typeof inaliaLite.slots>
}
export interface InaliaLiteEmits {}
export interface InaliaLiteSlots {
  default: () => any
}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaLiteProps>()
defineEmits<InaliaLiteEmits>()
defineSlots<InaliaLiteSlots>()

const { question, data } = useInaliaLiteQuestion(() => ({
  questionId: props.questionId,
  static: {
    question: props.question,
    type: props.type,
    data: props.data,
  },
}))

const ui = computed(() => inaliaLite())
</script>

<template>
  <template v-if="question">
    <InaliaDefaultLayout
      :question="question.question"
      :url="createAnswersCreateUrl(question.id)"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
    >
      <slot>
        <InaliaText
          v-if="question.type === 'text' && data"
          :data="data"
          :class="ui.textData({ class: props.ui?.textData })"
        />
        <InaliaSelect
          v-else-if="question.type === 'single_select' && data"
          chart="donut"
          :data="data"
          :options="question.options.choices"
          :class="ui.selectData({ class: props.ui?.selectData })"
        />
      </slot>
    </InaliaDefaultLayout>
  </template>
  <template v-else>
    <InaliaLoading />
  </template>
</template>
