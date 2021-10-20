import { CacheProvider, CacheStorageKey } from '@discordoo/providers'

export async function cacheProviderSweepPolyfill<K = string, V = any, P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string, storage: CacheStorageKey, predicate: (value: V, key: K, provider: P) => boolean | Promise<boolean>
): Promise<boolean> {
  const keys: K[] = [] // we do not delete keys immediately, because the provider may possibly give an error

  await provider.forEach<K, V>(keyspace, storage, async (value, key) => {
    if (await predicate(value, key, provider)) {
      keys.push(key)
    }
  })

  if (keys.length) {
    return provider.delete<K>(keyspace, storage, keys)
  }

  return true
}
