import { AbstractEmojiData, Resolvable } from '@src/api'
import { NonOptional } from '@src/utils'

export type EmojiResolvable = Resolvable<NonOptional<AbstractEmojiData, 'name' | 'id'>>
