<script lang="ts" setup>
import InaliaPoweredBy from '../components/InaliaPoweredBy.vue'
import InaliaQR from '../components/InaliaQR.vue'
import InaliaShortUrl from '../components/InaliaShortUrl.vue'
import { useInaliaTalk } from '../composables/useInaliaTalk'

const { talk } = useInaliaTalk()
</script>

<template>
  <div v-if="talk" class="h-full grid slidev-layout inalia-overview">
    <div class="flex justify-center items-center flex-col space-y-2">
      <div
        class="inalia shrink-0 rounded-lg overflow-hidden w-60 h-60"
      >
        <InaliaQR
          :url="talk.urls.tiny_overview" class="block"
        />
      </div>
      <InaliaShortUrl :url="talk.urls.tiny_overview" class="border-0! text-xs mx-auto" />
    </div>

    <div class="absolute op-40 bottom-2 left-1/2 -translate-x-1/2">
      <InaliaPoweredBy />
    </div>
  </div>
</template>
