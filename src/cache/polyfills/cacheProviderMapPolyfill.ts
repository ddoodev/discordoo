import { CacheProvider } from '@src/core'

export async function cacheProviderMapPolyfill<K = string, V = any, R = any, P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string, predicate: (value: V, key: K, provider: P) => R | Promise<R>
): Promise<R[]> {
  const results: R[] = []

  await provider.forEach<K, V>(keyspace, async (value, key) => {
    results.push(
      await predicate(value, key, provider)
    )
  })

  return results
}
