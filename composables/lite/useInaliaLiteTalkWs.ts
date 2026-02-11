import type { DeepReadonly, Ref } from 'vue'
import type { BroadcastedAnswer } from '../../types/lite/answer'
import { createSharedComposable, useWebSocket } from '@vueuse/core'
import { EVENT_LITE_ANSWER_CREATED } from 'lite'
import { readonly, ref } from 'vue'

interface UseInaliaLiteTalkWs {
  data: DeepReadonly<Ref<Map<number, string[]>>>
}

function _useInaliaLiteTalkWs(): UseInaliaLiteTalkWs {
  const data = ref<Map<number, string[]>>(new Map())

  useWebSocket(`${(import.meta.env.VITE_INALIA_LITE_URL ?? 'https://lite.inalia.app').startsWith('https:') ? 'wss' : 'ws'}://${import.meta.env.VITE_INALIA_LITE_URL ?? 'https://lite.inalia.app'}/api/talks/${import.meta.env.VITE_INALIA_LITE_TALK_ID}/ws`, {
    autoReconnect: true,
    heartbeat: true,
    onMessage: (_, event) => {
      if (event.data === 'pong') {
        return
      }

      const parsedEventData = JSON.parse(event.data) as {
        event: string
        payload: BroadcastedAnswer
      }

      if (parsedEventData.event === EVENT_LITE_ANSWER_CREATED) {
        const questionId = parsedEventData.payload.questionId
        const answer = parsedEventData.payload.value
        if (!data.value.has(questionId)) {
          data.value.set(questionId, [])
        }

        data.value.get(questionId)!.push(answer)
      }
    },
  })

  return {
    data: readonly(data),
  }
}

export const useInaliaLiteTalkWs = createSharedComposable(_useInaliaLiteTalkWs)
