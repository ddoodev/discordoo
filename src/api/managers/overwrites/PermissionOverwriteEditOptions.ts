import { CacheManagerFilterOptions } from '@src/cache'
import { PermissionOverwrite } from '@src/api/entities/overwrite/PermissionOverwrite'

export interface PermissionOverwriteEditOptions {
  /**
   * Options that will be used when retrieving overwrites from the cache.
   * WARNING: will be replaced to CacheManagerValuesOptions in the future.
   * */
  cache?: CacheManagerFilterOptions
  reason?: string
  existing?: PermissionOverwrite
}
