import { PermissionOverwriteTypes } from '@src/constants'
import { PermissionsResolvable } from '@src/api'

export interface PermissionOverwriteData {
  id: string
  type: PermissionOverwriteTypes
  allow: PermissionsResolvable
  deny: PermissionsResolvable
}
