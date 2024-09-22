interface GetInaliaEnv {
  endpoint: string
  apiKey: string
  username: string
  talkId: number
}

export function getInaliaEnv(): GetInaliaEnv {
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
