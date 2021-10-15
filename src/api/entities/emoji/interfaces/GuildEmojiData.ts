import { AbstractGuildEmojiData } from '@src/api/entities/emoji/interfaces/AbstractGuildEmojiData'
import { UserResolvable } from '@src/api/entities/user/interfaces/UserResolvable'
import { RoleResolvable } from '@src/api/entities/role'

export interface GuildEmojiData extends AbstractGuildEmojiData {
  user?: UserResolvable
  roles?: RoleResolvable[]
  userId?: string
  deleted?: boolean
}
