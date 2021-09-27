export type JsonProperties =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonProperties }
  | JsonProperties[]

export type Json = { [key: string]: JsonProperties }
