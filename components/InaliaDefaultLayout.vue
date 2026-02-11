<script lang="ts">
import type { DeepReadonly } from 'vue'
import type { Question } from '../types/question'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import InaliaPoweredBy from './InaliaPoweredBy.vue'
import InaliaQR from './InaliaQR.vue'
import InaliaShortUrl from './InaliaShortUrl.vue'

const inaliaDefaultLayout = tv({
  slots: {
    base: 'h-full w-full flex flex-row gap-8',
    content: 'flex flex-col grow',
    title: '',
    qrContainer: 'flex flex-col space-y-2 items-end',
    qrWrapper: 'inalia rounded-lg shrink-0 overflow-hidden w-40 h-40',
    qr: 'block',
    shortUrl: 'border-0! text-xs mx-auto',
    poweredBy: 'left-1/2 -translate-x-1/2 absolute op-40 bottom-2',
  },
})

export interface InaliaDefaultLayoutProps {
  question: DeepReadonly<Question>
  class?: any
  ui?: Partial<typeof inaliaDefaultLayout.slots>
}
export interface InaliaDefaultLayoutEmits {}
export interface InaliaDefaultLayoutSlots {
  default?: () => any
  title?: (props: { question: DeepReadonly<Question> }) => any
}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaDefaultLayoutProps>()
defineEmits<InaliaDefaultLayoutEmits>()
defineSlots<InaliaDefaultLayoutSlots>()

const ui = computed(() => inaliaDefaultLayout())
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <div :class="ui.content({ class: props.ui?.content })">
      <h1 :class="ui.title({ class: props.ui?.title })">
        <slot name="title" :question="question">
          {{ question.question }}
        </slot>
      </h1>

      <slot />
    </div>

    <template v-if="question.tiny_url">
      <div :class="ui.qrContainer({ class: props.ui?.qrContainer })">
        <div :class="ui.qrWrapper({ class: props.ui?.qrWrapper })">
          <InaliaQR
            :url="question.tiny_url" :class="ui.qr({ class: props.ui?.qr })"
          />
        </div>
        <InaliaShortUrl :url="question.tiny_url" :class="ui.shortUrl({ class: props.ui?.shortUrl })" />
      </div>
    </template>

    <div :class="ui.poweredBy({ class: props.ui?.poweredBy })">
      <InaliaPoweredBy />
    </div>
  </div>
</template>
