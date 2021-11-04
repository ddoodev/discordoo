import { PermissionOverwriteTypes } from '@src/constants'

export interface RawPermissionOverwriteData {
  id: string
  type: PermissionOverwriteTypes
  allow: string
  deny: string
}
