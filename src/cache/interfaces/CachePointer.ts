import { CacheStorageKey } from '@discordoo/providers'
import { CACHE_POINTER_PREFIX, Keyspaces } from '@src/constants'

// https://media.discordapp.net/attachments/531549268033404928/899632925572759582/unknown.png
export type CachePointer = `${typeof CACHE_POINTER_PREFIX}:${Keyspaces}:${CacheStorageKey}:${string}`
