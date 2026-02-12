import type { DeepReadonly, Ref } from 'vue'
import type { BroadcastedAnswer } from '../../types/lite/answer'
import { createSharedComposable, useWebSocket } from '@vueuse/core'
import { readonly, ref, shallowRef, watch } from 'vue'
import { INALIA_LITE_TALK_ID, INALIA_LITE_TOKEN, INALIA_LITE_URL } from '../../utils/lite/constants'
import { EVENT_LITE_ANSWER_CREATED } from '../../utils/lite/events'
import { isStaticTalk } from '../../utils/lite/static'

interface UseInaliaLiteTalkWs {
  data: DeepReadonly<Ref<Record<number, string[]>>>
}

function _useInaliaLiteTalkWs(): UseInaliaLiteTalkWs {
  const data = shallowRef<Record<number, string[]>>({})

  const { open } = useWebSocket(`${INALIA_LITE_URL.startsWith('https:') ? 'wss' : 'ws'}://${INALIA_LITE_URL.replace('https://', '').replace('http://', '')}/api/talks/${INALIA_LITE_TALK_ID}/ws`, {
    autoReconnect: true,
    heartbeat: true,
    onConnected: (ws) => {
      ws.send(JSON.stringify({
        event: 'authenticate',
        token: INALIA_LITE_TOKEN,
      }))
    },
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
        if (!data.value[questionId]) {
          data.value = {
            ...data.value,
            [questionId]: [],
          }
        }

        data.value[questionId] = [...data.value[questionId]!, answer]
      }
    },
    immediate: false,
  })

  if (!isStaticTalk) {
    open()
  }

  return {
    data: readonly(data),
  }
}

export const useInaliaLiteTalkWs = createSharedComposable(_useInaliaLiteTalkWs)
