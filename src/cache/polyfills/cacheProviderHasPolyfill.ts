import { CacheProvider, CacheStorageKey } from '@discordoo/providers'

export async function cacheProviderHasPolyfill<K = string, P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string, storage: CacheStorageKey, key: K
): Promise<boolean> {
  return !!(await provider.get<K>(keyspace, storage, key))
}
