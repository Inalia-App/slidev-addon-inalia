declare module '@slidev/types' {
  interface SlidevConfig {
    inalia?: {
      donut?: {
        cornerRadius?: number
        padAngle?: number
        arcWidth?: number
        showBackground?: boolean
      }
      bar?: {
        barWidth?: number
        barPadding?: number
        roundedCorners?: number | boolean
      }
    }
  }
}

export {}
