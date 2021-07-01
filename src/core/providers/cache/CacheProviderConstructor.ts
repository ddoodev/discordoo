import { Client } from '@src/core'

export interface CacheProviderConstructor<CacheProvider> {
  new (client: Client, ...options: any[]): CacheProvider
}
