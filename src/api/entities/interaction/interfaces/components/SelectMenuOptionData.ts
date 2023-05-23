import { AbstractEmojiData } from '@src/api'

export interface SelectMenuOptionData {
  label: string
  value: string
  description?: string
  emoji?: Required<AbstractEmojiData>
  default?: boolean
}
