import { RawGuildEmojiData } from '@src/api'

export interface RawGuildEmojisUpdatedEventData {
  guild_id: string
  emojis: RawGuildEmojiData[]
}