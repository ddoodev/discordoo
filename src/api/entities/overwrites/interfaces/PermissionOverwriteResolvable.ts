import { PermissionOverwrite } from '@src/api/entities/overwrites/PermissionOverwrite'
import { PermissionOverwriteTypes } from '@src/constants'
import { PermissionOverwriteData } from '@src/api/entities/overwrites/interfaces/PermissionOverwriteData'
import { RawPermissionOverwriteData } from '@src/api/entities/overwrites/interfaces/RawPermissionOverwriteData'
import { OverwrittenPermissions } from '@src/api/entities/overwrites/interfaces/OverwrittenPermissions'

export type PermissionOverwriteResolvable =
  PermissionOverwrite
  | OverwrittenPermissions & { type: PermissionOverwriteTypes; id: string }
  | PermissionOverwriteData
  | RawPermissionOverwriteData
