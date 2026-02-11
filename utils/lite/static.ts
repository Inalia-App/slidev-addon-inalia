import { INALIA_LITE_KEY, INALIA_LITE_TALK_ID } from './constants'

export const isStaticEnabled
  = !INALIA_LITE_TALK_ID
    || !INALIA_LITE_KEY
