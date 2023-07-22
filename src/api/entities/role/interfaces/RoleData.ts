import { PermissionsResolvable } from '@src/api'
import { RoleTagsResolvable } from '@src/api/entities/role/interfaces/RoleTagsResolvable'

export interface RoleData {
  id: string
  name: string
  color: number
  hoist: boolean
  icon?: string
  unicodeEmoji?: string
  rawPosition: number
  permissions: PermissionsResolvable
  managed: boolean
  mentionable: boolean
  tags?: RoleTagsResolvable
  guildId: string
}
