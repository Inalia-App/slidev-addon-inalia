import { INALIA_API_KEY, INALIA_TALK_NUMBER, INALIA_USERNAME } from './constants'

export const isStaticTalk
  = !INALIA_USERNAME
    || !INALIA_TALK_NUMBER
    || !INALIA_API_KEY
