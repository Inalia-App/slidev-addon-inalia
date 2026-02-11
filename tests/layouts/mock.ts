import type { Talk } from '../../types/talk'

export const mockTalk: Talk = {
  id: 1,
  title: 'Test Talk',
  description: 'A test presentation',
  color: '#3b82f6',
  scheduled_at: {
    iso: '2024-01-01T10:00:00Z',
    time_ago: '1 day ago',
  },
  state: {
    disabled: false,
    running: true,
    finished: false,
  },
  slidev: {
    run_to_continue: false,
  },
  urls: {
    details: 'https://inalia.app/talks/1',
    overview: 'https://inalia.app/talks/1/overview',
    dashboard: 'https://inalia.app/talks/1/dashboard',
    tiny_overview: 'https://inalia.app/abc123',
    tiny_feedback: 'https://inalia.app/xyz789',
  },
}
