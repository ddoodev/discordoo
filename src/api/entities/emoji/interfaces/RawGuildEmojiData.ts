import { RawAbstractGuildEmojiData } from '@src/api/entities/emoji/interfaces/RawAbstractGuildEmojiData'
import { RawUserData } from '@src/api/entities/user/interfaces/RawUserData'

export interface RawGuildEmojiData extends RawAbstractGuildEmojiData {
  id: string
  name: string
  guild_id: string
  user: RawUserData
  roles?: string[]
  user_id?: string
}
