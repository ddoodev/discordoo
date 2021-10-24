import { CacheProvider, CacheStorageKey } from '@discordoo/providers'

export async function cacheProviderCountPolyfill<K = string, V = any, P extends CacheProvider = CacheProvider>(
  provider: P,
  keyspace: string,
  storage: CacheStorageKey,
  predicate: (value: V, key: K, provider: P) => boolean | Promise<boolean>
): Promise<number> {
  let result = 0

  await provider.forEach<K, V, P>(keyspace, storage, async (value, key, prov) => {
    if (await predicate(value, key, prov)) {
      result++
    }
  })

  return result
}
