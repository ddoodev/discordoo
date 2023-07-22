import { AbstractEmojiData } from '@src/api/entities/emoji/interfaces/AbstractEmojiData'

export interface AbstractGuildEmojiData extends AbstractEmojiData {
  guildId?: string
  requiresColons?: boolean
  managed?: boolean
  available?: boolean
}
