import { CacheProvider, CacheStorageKey } from '@discordoo/providers'

export async function cacheProviderMapPolyfill<K = string, V = any, R = any, P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string, storage: CacheStorageKey, predicate: (value: V, key: K, provider: P) => R | Promise<R>
): Promise<R[]> {
  const results: R[] = []

  await provider.forEach<K, V>(keyspace, storage, async (value, key) => {
    results.push(
      await predicate(value, key, provider)
    )
  })

  return results
}
