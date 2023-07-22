import { CacheProvider, CacheStorageKey } from '@discordoo/providers'

export async function cacheProviderFindPolyfill<K = string, V = any, P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string, storage: CacheStorageKey, predicate: (value: V, key: K, provider: P) => boolean | Promise<boolean>
): Promise<V | undefined> {
  let result: V | undefined, found = false

  await provider.forEach<K, V>(keyspace, storage, async (value, key) => {
    if (!found && await predicate(value, key, provider)) {
      result = value
      found = true
    }
  })

  return result
}
