import { CacheManagerFilterOptions } from '@src/cache'
import { PermissionsOverwrite } from '@src/api/entities/overwrites/PermissionsOverwrite'

export interface PermissionsOverwriteEditOptions {
  /**
   * Options that will be used when retrieving overwrites from the cache.
   * WARNING: will be replaced to CacheManagerValuesOptions in the future.
   * */
  cache?: CacheManagerFilterOptions
  reason?: string
  existing?: PermissionsOverwrite
}
