import { NonOptional } from '@src/utils'
import { AbstractEmojiData } from '@src/api'

export type ActivityEmojiData = NonOptional<AbstractEmojiData, 'name'>
