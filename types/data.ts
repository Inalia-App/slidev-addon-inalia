export type TextData = string[]

export type SelectData = {
  color: string
  label: string
  count: number
}[]

export type Data = TextData | SelectData
