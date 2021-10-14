import { UserResolvable } from '@src/api/entities/user/interfaces/UserResolvable'
import { RoleResolvable } from '@src/api/entities/role'
import { PermissionsResolvable } from '@src/api/entities/bitfield'

export interface GuildMemberData {
  user?: UserResolvable
  nick?: string
  avatar?: string
  roles: RoleResolvable[]
  joinedAt: Date
  premiumSince?: Date
  deaf: boolean
  mute: boolean
  pending?: boolean
  permissions?: PermissionsResolvable
}
