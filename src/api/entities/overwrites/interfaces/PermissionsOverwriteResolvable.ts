import { PermissionsOverwrite } from '@src/api/entities/overwrites/PermissionsOverwrite'
import { PermissionsOverwriteTypes } from '@src/constants'
import { PermissionsOverwriteData } from '@src/api/entities/overwrites/interfaces/PermissionsOverwriteData'
import { RawPermissionsOverwriteData } from '@src/api/entities/overwrites/interfaces/RawPermissionsOverwriteData'
import { OverwrittenPermissions } from '@src/api/entities/overwrites/interfaces/OverwrittenPermissions'

export type PermissionsOverwriteResolvable =
  PermissionsOverwrite
  | OverwrittenPermissions & { type: PermissionsOverwriteTypes; id: string }
  | PermissionsOverwriteData
  | RawPermissionsOverwriteData
