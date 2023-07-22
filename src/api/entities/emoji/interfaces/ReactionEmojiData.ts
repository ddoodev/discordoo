import { AbstractEmojiData } from '@src/api/entities/emoji/interfaces/AbstractEmojiData'

export interface ReactionEmojiData extends AbstractEmojiData {
  reactionMessageId: string
}
