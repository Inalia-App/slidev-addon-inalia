import { ofetch } from 'ofetch'
import { describe, expect, it, vi } from 'vitest'
import { authorizeChannel } from '../../utils/authorize'

vi.mock('ofetch', () => ({ ofetch: vi.fn() }))

describe('broadcast authorization', () => {
  it('reports successful authentication exactly once', async () => {
    const data = { auth: 'signed-auth' }
    vi.mocked(ofetch).mockResolvedValueOnce(data)
    const callback = vi.fn()
    await authorizeChannel('private-talk.1', 'socket.1', callback)
    expect(callback).toHaveBeenCalledExactlyOnceWith(null, data)
  })

  it.each(['401 Unauthorized', '403 Forbidden', 'Network failure'])('reports %s as an error exactly once', async (message) => {
    const error = new Error(message)
    vi.mocked(ofetch).mockRejectedValueOnce(error)
    const callback = vi.fn()
    await authorizeChannel('private-talk.1', 'socket.1', callback)
    expect(callback).toHaveBeenCalledExactlyOnceWith(error, null)
  })
})
