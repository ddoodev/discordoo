import { PermissionOverwrite } from '@src/api/entities/overwrites/PermissionOverwrite'

export interface PermissionOverwriteUpsertOptions {
  reason?: string
  existing?: PermissionOverwrite
}
