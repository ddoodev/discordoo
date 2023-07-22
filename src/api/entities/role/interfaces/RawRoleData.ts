import { RoleTagsResolvable } from '@src/api/entities/role/interfaces/RoleTagsResolvable'

export interface RawRoleData {
  id: string
  name: string
  color: number
  hoist: boolean
  icon?: string
  unicode_emoji?: string
  position: number
  permissions: string
  managed: boolean
  mentionable: boolean
  tags?: RoleTagsResolvable
  guild_id: string
}
