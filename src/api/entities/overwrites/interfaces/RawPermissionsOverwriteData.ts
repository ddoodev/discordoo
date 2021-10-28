import { PermissionsOverwriteTypes } from '@src/constants'

export interface RawPermissionsOverwriteData {
  id: string
  type: PermissionsOverwriteTypes
  allow: string
  deny: string
}
