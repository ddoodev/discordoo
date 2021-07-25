import { CacheProvider } from '@src/core'

export async function cacheProviderSweepPolyfill<K = string, V = any, P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string, predicate: (value: V, key: K, provider: P) => boolean | Promise<boolean>
): Promise<boolean> {
  const keys: K[] = []

  await provider.forEach<K, V>(keyspace, async (value, key) => {
    if (await predicate(value, key, provider)) {
      keys.push(key)
    }
  })

  if (keys.length) {
    return provider.delete<K>(keyspace, keys)
  }

  return false
}
