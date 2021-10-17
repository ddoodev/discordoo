import { GuildResolvable } from '@src/api/entities/guild/interfaces/GuildResolvable'

export interface StickerDeleteOptions {
  reason?: string
  guild?: GuildResolvable
}
