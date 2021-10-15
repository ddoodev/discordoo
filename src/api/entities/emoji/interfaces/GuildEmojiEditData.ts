import { RoleResolvable } from '@src/api/entities/role'

export interface GuildEmojiEditData {
  roles?: RoleResolvable[]
  name?: string
  guildId?: string
  id?: string
}
