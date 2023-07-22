import { CacheProvider, CacheStorageKey } from '@discordoo/providers'

export async function cacheProviderClearPolyfill<P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string, storage: CacheStorageKey
): Promise<boolean> {
  const keys: any[] = [] // we do not delete keys immediately, because the provider may possibly give an error

  await provider.forEach(keyspace, storage, (v, k) => {
    keys.push(k)
  })

  if (keys.length) {
    return provider.delete(keyspace, storage, keys)
  }

  return true
}
