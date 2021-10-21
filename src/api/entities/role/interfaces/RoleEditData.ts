import { ColorResolvable, PermissionsResolvable } from '@src/api'
import { Base64Resolvable } from '@src/utils/interfaces/Base64Resolvable'

export interface RoleEditData {
  name?: string
  permissions?: PermissionsResolvable
  color?: ColorResolvable
  hoist?: boolean
  icon?: Base64Resolvable
  unicodeEmoji?: string
  mentionable?: boolean
}
