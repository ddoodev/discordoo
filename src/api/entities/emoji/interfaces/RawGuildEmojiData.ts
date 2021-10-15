import { RawAbstractGuildEmojiData } from '@src/api/entities/emoji/interfaces/RawAbstractGuildEmojiData'
import { RoleResolvable } from '@src/api/entities/role'
import { RawUserData } from '@src/api/entities/user/interfaces/RawUserData'

export interface RawGuildEmojiData extends RawAbstractGuildEmojiData {
  user: RawUserData
  roles?: RoleResolvable[]
  user_id?: string
}
