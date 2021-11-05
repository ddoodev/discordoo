import { CachePointer } from '@src/cache'
import { Keyspaces } from '@src/constants'
import { CacheStorageKey } from '@discordoo/providers'

export function cachePointer(keyspace: Keyspaces, storage: CacheStorageKey, key: string): CachePointer {
  return {
    ___type___: 'discordooCachePointer',
    keyspace,
    storage,
    key,
  }
}
