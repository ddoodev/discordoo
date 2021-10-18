import { CacheStorageKey } from '@discordoo/providers'

// https://media.discordapp.net/attachments/531549268033404928/899632925572759582/unknown.png
export interface CachePointer {
  ___type___: 'discordooCachePointer'
  keyspace: string
  storage: CacheStorageKey
  key: string
}
