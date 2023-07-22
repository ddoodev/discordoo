import { CacheProvider, CacheStorageKey } from '@discordoo/providers'

export async function cacheProviderCountsPolyfill<K = string, V = any, P extends CacheProvider = CacheProvider>(
  provider: P,
  keyspace: string,
  storage: CacheStorageKey,
  predicates: ((value: V, key: K, provider: P) => boolean | Promise<boolean>)[]
): Promise<number[]> {
  const results = Array.from({ length: predicates.length }, () => 0)

  if (results.length === 0) return []

  await provider.forEach<K, V, P>(keyspace, storage, async (value, key, prov) => {
    let i = 0
    for await (const predicate of predicates) {
      if (await predicate(value, key, prov)) {
        results[i]++
      }
      i++
    }
  })

  return results
}
