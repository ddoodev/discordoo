import { CacheManagerOperationOptions } from '@src/cache/interfaces/CacheManagerOperationOptions'
import { CacheStorageKey } from '@discordoo/providers'

export interface CacheManagerSetOptions extends CacheManagerOperationOptions {
  storage?: CacheStorageKey
}
