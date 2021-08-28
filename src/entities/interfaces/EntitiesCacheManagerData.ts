import { CachingOptions } from '@src/cache'
import { EntityKey } from '@src/entities'
import { CacheStorageKey } from '@discordoo/providers'

export interface EntitiesCacheManagerData {
  keyspace: string
  storage: CacheStorageKey
  entity: EntityKey
  policy?: keyof CachingOptions
}
