import { AbstractEmojiData } from '../../../../../../src/api'

export interface SelectMenuOptionData {
  label: string
  value: string
  description?: string
  emoji?: AbstractEmojiData
  default?: boolean
}
