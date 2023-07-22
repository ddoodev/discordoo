import { CacheProvider, CacheStorageKey } from '../../../../providers/src/_index'

export async function cacheProviderEntriesPolyfill<K = string, V = any, P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string, storage: CacheStorageKey
): Promise<Array<[ K, V ]>> {
  const results: any[] = []

  await provider.forEach(keyspace, storage, (v, k) => {
    results.push([ k, v ])
  })

  return results
}