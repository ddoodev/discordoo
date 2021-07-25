import { CacheProvider } from '@src/core'

export async function cacheProviderHasPolyfill<K = string, P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string, key: K
): Promise<boolean> {
  return !!(await provider.get<K>(keyspace, key))
}
