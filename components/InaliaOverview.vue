<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useInaliaTalk } from '../composables/useInaliaTalk'
import InaliaPoweredBy from './InaliaPoweredBy.vue'
import InaliaQR from './InaliaQR.vue'
import InaliaShortUrl from './InaliaShortUrl.vue'

const inaliaOverview = tv({
  slots: {
    base: 'h-full grid slidev-layout inalia-overview',
    content: 'flex justify-center items-center flex-col space-y-2',
    qrContainer: 'inalia shrink-0 rounded-lg overflow-hidden w-60 h-60',
    qr: 'block',
    shortUrl: 'border-0! text-xs mx-auto',
    footer: 'absolute op-40 bottom-2 left-1/2 -translate-x-1/2',
  },
})

export interface InaliaOverviewProps {
  class?: any
  ui?: Partial<typeof inaliaOverview.slots>
}
export interface InaliaOverviewEmits {}
export interface InaliaOverviewSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaOverviewProps>()
defineEmits<InaliaOverviewEmits>()
defineSlots<InaliaOverviewSlots>()

const { talk } = useInaliaTalk()

const ui = computed(() => inaliaOverview())
</script>

<template>
  <div v-if="talk" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <div :class="ui.content({ class: props.ui?.content })">
      <div :class="ui.qrContainer({ class: props.ui?.qrContainer })">
        <InaliaQR
          :url="talk.urls.tiny_overview"
          :class="ui.qr({ class: props.ui?.qr })"
        />
      </div>
      <InaliaShortUrl
        :url="talk.urls.tiny_overview"
        :class="ui.shortUrl({ class: props.ui?.shortUrl })"
      />
    </div>

    <div :class="ui.footer({ class: props.ui?.footer })">
      <InaliaPoweredBy />
    </div>
  </div>
</template>
