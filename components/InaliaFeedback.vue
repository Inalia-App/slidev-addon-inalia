<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useInaliaTalk } from '../composables/useInaliaTalk'
import InaliaPoweredBy from './InaliaPoweredBy.vue'
import InaliaQR from './InaliaQR.vue'
import InaliaShortUrl from './InaliaShortUrl.vue'

const inaliaFeedback = tv({
  slots: {
    base: 'h-full grid slidev-layout inalia-feedback',
    content: 'flex justify-center items-center flex-col space-y-2',
    qrContainer: 'inalia shrink-0 rounded-lg overflow-hidden w-60 h-60',
    qr: 'block',
    shortUrl: 'border-0! text-xs mx-auto',
    footer: 'absolute op-40 bottom-2 left-1/2 -translate-x-1/2',
  },
})

export interface InaliaFeedbackProps {
  class?: any
  ui?: Partial<typeof inaliaFeedback.slots>
}
export interface InaliaFeedbackEmits {}
export interface InaliaFeedbackSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaFeedbackProps>()
defineEmits<InaliaFeedbackEmits>()
defineSlots<InaliaFeedbackSlots>()

const { talk } = useInaliaTalk()

const ui = computed(() => inaliaFeedback())
</script>

<template>
  <div v-if="talk" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <div :class="ui.content({ class: props.ui?.content })">
      <div :class="ui.qrContainer({ class: props.ui?.qrContainer })">
        <InaliaQR
          :url="talk.urls.tiny_feedback"
          :class="ui.qr({ class: props.ui?.qr })"
        />
      </div>
      <InaliaShortUrl
        :url="talk.urls.tiny_feedback"
        :class="ui.shortUrl({ class: props.ui?.shortUrl })"
      />
    </div>

    <div :class="ui.footer({ class: props.ui?.footer })">
      <InaliaPoweredBy />
    </div>
  </div>
</template>
