import { CacheStorageKey } from '@discordoo/providers'
import { CACHE_POINTER_PREFIX, Keyspaces } from '@src/constants'

// https://cdn.ddoo.dev/github/cache-pointer.png
export type CachePointer = `${typeof CACHE_POINTER_PREFIX}:${Keyspaces}:${CacheStorageKey}:${string}`
