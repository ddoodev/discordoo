import { CachePointer } from '@src/cache'
import { CACHE_POINTER_PREFIX, Keyspaces } from '@src/constants'
import { CacheStorageKey } from '@discordoo/providers'

export function makeCachePointer(keyspace: Keyspaces, storage: CacheStorageKey, key: string): CachePointer {
  return `${CACHE_POINTER_PREFIX}:${keyspace}:${storage}:${key}`
}

export function isCachePointer(pointer: any): false | [ string, string, string ] {
  if (typeof pointer === 'string' && pointer.startsWith(CACHE_POINTER_PREFIX)) {
    const info = pointer.split(':')

    if (info.length === 4 && info[0] === CACHE_POINTER_PREFIX) {
      return [ info[1], info[2], info[3] ]
    }
  }

  return false
}