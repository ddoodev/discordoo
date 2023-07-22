import { PermissionOverwrite } from '@src/api/entities/overwrite/PermissionOverwrite'
import { PermissionOverwriteTypes } from '@src/constants'
import { PermissionOverwriteData } from '@src/api/entities/overwrite/interfaces/PermissionOverwriteData'
import { RawPermissionOverwriteData } from '@src/api/entities/overwrite/interfaces/RawPermissionOverwriteData'
import { OverwrittenPermissions } from '@src/api/entities/overwrite/interfaces/OverwrittenPermissions'

export type PermissionOverwriteResolvable =
  PermissionOverwrite
  | OverwrittenPermissions & { type: PermissionOverwriteTypes; id: string }
  | PermissionOverwriteData
  | RawPermissionOverwriteData
