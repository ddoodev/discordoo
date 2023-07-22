import { CacheProvider, CacheStorageKey } from '@discordoo/providers'

export async function cacheProviderKeysPolyfill<K = string, P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string, storage: CacheStorageKey
): Promise<K[]> {
  const keys: any[] = []

  await provider.forEach(keyspace, storage, (v, k) => {
    keys.push(k)
  })

  return keys
}