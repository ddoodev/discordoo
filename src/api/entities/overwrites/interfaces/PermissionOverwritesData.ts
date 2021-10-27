import { PermissionOverwriteTypes } from '@src/constants'
import { PermissionsResolvable } from '@src/api'

export interface PermissionOverwritesData {
  type: PermissionOverwriteTypes
  allow: PermissionsResolvable
  deny: PermissionsResolvable
}
