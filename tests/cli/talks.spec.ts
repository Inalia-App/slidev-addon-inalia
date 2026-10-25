import { ofetch } from 'ofetch'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { listTalks } from '../../bin/talks.mjs'

vi.mock('ofetch', () => ({ ofetch: vi.fn() }))

beforeEach(() => vi.resetAllMocks())

describe('talk selection list', () => {
  it('requests all talks using the configured endpoint and bearer token', async () => {
    const talks = [{ number: 2, title: 'My talk' }, { number: 1, title: 'My talk' }]
    vi.mocked(ofetch).mockResolvedValue({ data: talks })

    expect(await listTalks('https://example.com/', ' speaker ', ' secret ')).toEqual(talks)
    expect(ofetch).toHaveBeenCalledWith('https://example.com/api/speaker/talks', {
      headers: { Authorization: 'Bearer secret', Accept: 'application/json' },
      timeout: 15000,
      retry: 0,
      redirect: 'error',
    })
  })

  it('allows an empty account', async () => {
    vi.mocked(ofetch).mockResolvedValue({ data: [] })
    expect(await listTalks('https://inalia.app', 'speaker', 'secret')).toEqual([])
  })

  it('reports request failures without disclosing credentials', async () => {
    vi.mocked(ofetch).mockRejectedValue(new Error('secret'))
    await expect(listTalks('https://inalia.app', 'speaker', 'secret')).rejects.toThrow('Could not list talks.')
  })

  it.each([null, {}, { data: {} }, { data: [null] }, { data: [{ title: 'Missing number' }] }])('rejects an invalid response: %j', async (response) => {
    vi.mocked(ofetch).mockResolvedValue(response)
    await expect(listTalks('https://inalia.app', 'speaker', 'secret')).rejects.toThrow('Unexpected talk list response.')
  })

  it('rejects non-HTTP endpoints before sending credentials', async () => {
    await expect(listTalks('ftp://example.com', 'speaker', 'secret')).rejects.toThrow('HTTP(S)')
    expect(ofetch).not.toHaveBeenCalled()
  })
})
