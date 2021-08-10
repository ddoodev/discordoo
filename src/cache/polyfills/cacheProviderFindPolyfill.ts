import { CacheProvider } from '@src/core'
import { CacheStorageKey } from '@src/cache/interfaces/CacheStorageKey'

export async function cacheProviderFindPolyfill<K = string, V = any, P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string, storage: CacheStorageKey, predicate: (value: V, key: K, provider: P) => boolean | Promise<boolean>
): Promise<V | undefined> {
  let result: V | undefined

  await provider.forEach<K, V>(keyspace, storage, async (value, key) => {
    if (await predicate(value, key, provider)) {
      result = value
    }
  })

  return result
}
