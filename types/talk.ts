export interface Talk {
  id: number
  title: string
  description: string
  color: string
  scheduled_at: {
    iso: string
    time_ago: string
  }
  urls: {
    details: string
    overview: string
    tiny_overview: string
  }
}
