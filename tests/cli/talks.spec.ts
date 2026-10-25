import { ofetch } from 'ofetch'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchUsername, listTalks } from '../../cli/talks'

vi.mock('ofetch', () => ({ ofetch: vi.fn() }))

beforeEach(() => vi.resetAllMocks())

describe('talk selection account discovery', () => {
  it('discovers the token owner before listing their talks', async () => {
    vi.mocked(ofetch).mockResolvedValueOnce({ data: { username: 'owner/name' } }).mockResolvedValueOnce({ data: [] })

    const username = await fetchUsername('https://example.com/', ' secret ')
    await listTalks('https://example.com/', username, ' secret ')

    expect(ofetch).toHaveBeenNthCalledWith(1, 'https://example.com/api/me', {
      headers: { Authorization: 'Bearer secret', Accept: 'application/json' },
      timeout: 15000,
      retry: 0,
      redirect: 'error',
    })
    expect(ofetch).toHaveBeenNthCalledWith(2, 'https://example.com/api/owner%2Fname/talks', expect.any(Object))
  })

  it.each([null, {}, { data: {} }, { data: { username: '' } }, { data: { username: ' ' } }])('rejects a missing username: %j', async (response) => {
    vi.mocked(ofetch).mockResolvedValue(response)
    await expect(fetchUsername('https://inalia.app', 'secret')).rejects.toThrow('username is missing')
  })

  it('reports discovery failures without disclosing credentials', async () => {
    vi.mocked(ofetch).mockRejectedValue(new Error('secret'))
    await expect(fetchUsername('https://inalia.app', 'secret')).rejects.toThrow('Could not discover the Inalia account.')
  })

  it('rejects non-HTTP discovery endpoints before sending credentials', async () => {
    await expect(fetchUsername('ftp://example.com', 'secret')).rejects.toThrow('HTTP(S)')
    expect(ofetch).not.toHaveBeenCalled()
  })
})

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
