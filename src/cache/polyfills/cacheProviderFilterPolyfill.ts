import { CacheProvider } from '@src/core'

export async function cacheProviderFilterPolyfill<K = string, V = any, P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string, predicate: (value: V, key: K, provider: P) => boolean | Promise<boolean>
): Promise<[ K, V ][]> {
  const results: [ K, V ][] = []

  await provider.forEach<K, V>(keyspace, async (value, key) => {
    if (await predicate(value, key, provider)) {
      results.push([ key, value ])
    }
  })

  return results
}
