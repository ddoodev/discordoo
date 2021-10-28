import { PermissionsOverwriteTypes } from '@src/constants'
import { PermissionsResolvable } from '@src/api'

export interface PermissionsOverwriteData {
  id: string
  type: PermissionsOverwriteTypes
  allow: PermissionsResolvable
  deny: PermissionsResolvable
}
