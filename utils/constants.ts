export const INALIA_ENDPOINT = import.meta.env.VITE_INALIA_ENDPOINT ?? 'https://inalia.app'
// The local session is a dev-server capability, never an OAuth access token.
export const INALIA_OAUTH = typeof __INALIA_OAUTH_MODE__ !== 'undefined' && __INALIA_OAUTH_MODE__
export const INALIA_OAUTH_SESSION = typeof __INALIA_OAUTH_SESSION__ !== 'undefined' ? __INALIA_OAUTH_SESSION__ : ''
export const INALIA_API_KEY = import.meta.env.VITE_INALIA_API_KEY

export const INALIA_AUTHENTICATED = INALIA_OAUTH ? !!INALIA_OAUTH_SESSION : !!INALIA_API_KEY

export const INALIA_TALK_NUMBER = import.meta.env.VITE_INALIA_TALK_NUMBER
