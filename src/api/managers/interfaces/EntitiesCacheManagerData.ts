import { CacheOptions } from '@src/cache'
import { EntityKey } from '@src/api/entities'
import { CacheStorageKey } from '@discordoo/providers'

export interface EntitiesCacheManagerData {
  keyspace: string
  storage: CacheStorageKey
  entity: EntityKey
  policy?: keyof CacheOptions
}
