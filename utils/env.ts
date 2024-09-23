interface GetInaliaEnv {
  endpoint: string
  apiKey: string
  username: string
  talkId: number
}

/**
 * If the environment variable `VITE_REVERB_APP_KEY` is not set, Inalia can only be used in static mode so there is no need to throw errors for missing environment variables.
 */
export function getInaliaEnv(): GetInaliaEnv {
  if (!import.meta.env.VITE_REVERB_APP_KEY) {
    return {
      endpoint: '',
      apiKey: '',
      username: '',
      talkId: 0,
    }
  }

  const endpoint = import.meta.env.VITE_INALIA_ENDPOINT

  if (!endpoint) {
    throw new Error('Missing Inalia endpoint')
  }

  const apiKey = import.meta.env.VITE_INALIA_API_KEY

  if (!apiKey) {
    throw new Error('Missing Inalia API key')
  }

  const username = import.meta.env.VITE_INALIA_USERNAME

  if (!username) {
    throw new Error('Missing Inalia username')
  }

  const talkId = import.meta.env.VITE_INALIA_TALK_ID

  if (!talkId) {
    throw new Error('Missing Inalia talk ID')
  }

  return {
    endpoint,
    apiKey,
    username,
    talkId: Number(talkId),
  }
}
