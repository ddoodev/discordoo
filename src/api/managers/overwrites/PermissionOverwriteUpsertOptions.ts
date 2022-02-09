import { PermissionOverwrite } from '@src/api/entities/overwrite/PermissionOverwrite'

export interface PermissionOverwriteUpsertOptions {
  reason?: string
  existing?: PermissionOverwrite
}
