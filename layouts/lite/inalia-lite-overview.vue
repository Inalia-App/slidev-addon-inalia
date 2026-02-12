<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import InaliaPoweredBy from '../../components/InaliaPoweredBy.vue'
import InaliaQR from '../../components/InaliaQR.vue'
import { createTalkOverviewUrl } from '../../utils/lite/urls'

const inaliaLiteOverview = tv({
  slots: {
    base: 'h-full grid slidev-layout inalia-lite-overview',
    content: 'flex justify-center items-center flex-col space-y-2',
    qr: 'size-60',
    footer: 'absolute op-40 bottom-2 left-1/2 -translate-x-1/2',
  },
})

export interface InaliaLiteOverviewProps {
  class?: any
  ui?: Partial<typeof inaliaLiteOverview.slots>
}
export interface InaliaLiteOverviewEmits {}
export interface InaliaLiteOverviewSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaLiteOverviewProps>()
defineEmits<InaliaLiteOverviewEmits>()
defineSlots<InaliaLiteOverviewSlots>()

const url = computed(() => createTalkOverviewUrl())

const ui = computed(() => inaliaLiteOverview())
</script>

<template>
  <div v-if="url" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <div
      :class="ui.content({ class: props.ui?.content })"
    >
      <InaliaQR
        :url="url"
        :class="ui.qr({ class: props.ui?.qr })"
      />
    </div>
    <div :class="ui.footer({ class: props.ui?.footer })">
      <InaliaPoweredBy />
    </div>
  </div>
</template>
