export interface Talk {
  id: number
  title: string
  description: string
  color: string
  scheduled_at: {
    iso: string
    time_ago: string
  }
  state: {
    disabled: boolean
    running: boolean
    finished: boolean
  }
  slidev: {
    run_to_continue: boolean
  }
  urls: {
    details: string
    overview: string
    tiny_overview: string
    tiny_feedback: string
  }
}
