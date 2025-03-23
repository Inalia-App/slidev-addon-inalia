export interface LiveReaction {
  emoji: string
}

export interface AugmentedLiveReaction extends LiveReaction {
  id: string
  position: {
    x: number
    y: number
  }
  scale: number
}
