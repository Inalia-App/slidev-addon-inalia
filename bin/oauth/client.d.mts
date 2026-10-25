export interface LoginOptions {
  endpoint?: string
  open?: boolean
  readOnly?: boolean
  onUrl?: (message: string) => void
}

export function login(options?: LoginOptions): Promise<void>
export function logout(endpoint?: string): Promise<void>
export function accessToken(endpoint: string): Promise<string>
export function pkceChallenge(verifier: string): string
export function trustedUrl(value: string, endpoint: string): string
