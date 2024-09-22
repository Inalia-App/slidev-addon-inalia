export interface Talk {
  id: number
  title: string
  description: string
  scheduled_at: {
    date: string
    human: string
  }
  color: string
}
