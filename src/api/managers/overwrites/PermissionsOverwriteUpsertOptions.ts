import { PermissionsOverwrite } from '@src/api/entities/overwrites/PermissionsOverwrite'

export interface PermissionsOverwriteUpsertOptions {
  reason?: string
  existing?: PermissionsOverwrite
}
