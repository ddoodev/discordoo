import { AbstractEmojiData } from '@src/api/entities/emoji/interfaces/AbstractEmojiData'

export interface RawAbstractGuildEmojiData extends AbstractEmojiData {
  guild_id?: string
  requires_colons?: boolean
  managed?: boolean
  available?: boolean
}
