import { Client } from '@src/core'
import { Collection } from '@discordoo/collection'
import { CacheStorageKey, CacheProvider } from '@discordoo/providers'

export class DefaultCacheProvider implements CacheProvider {
  private keyspaces: Collection<string, Collection<string, Collection>>

  public client: Client
  public compatible: 'classes' = 'classes'
  public sharedCache = false

  constructor(client: Client) {
    this.keyspaces = new Collection<string, Collection<string, Collection>>()
    this.client = client
  }

  async init(): Promise<void> {
    setInterval(() => {
      this.keyspaces.forEach((keyspace, keyspaceKey) => {
        if (keyspace.empty) {
          this.keyspaces.delete(keyspaceKey)
        } else {
          keyspace.forEach((storage, storageKey) => {
            if (storage.empty) {
              keyspace.delete(storageKey)
            }
          })
        }
      })
    }, 2 * 60 * 1000)
  }

  async set<K = string, V = any>(keyspace: string, storage: CacheStorageKey, key: K, value: V): Promise<DefaultCacheProvider> {
    let space = this.keyspaces.get(keyspace)

    if (!space) {
      this.keyspaces.set(keyspace, new Collection())
      space = this.keyspaces.get(keyspace)!
    }

    let store = space.get(storage)

    if (!store) {
      space.set(storage, new Collection())
      store = space.get(storage)!
    }

    return store.set(key, value) && this // returns this
  }

  async get<K = string, V = any>(keyspace: string, storage: CacheStorageKey, key: K): Promise<V | undefined> {
    const space = this.keyspaces.get(keyspace)

    if (!space) return void 100500

    if (storage === 'global') {
      let result

      space.forEach(store => {
        const r = store.get(key)
        if (r) result = r
      })

      return result
    } else {
      const store = space.get(storage)

      if (!store) return void 100500

      return store.get(key)
    }
  }

  async forEach<K = string, V = any, P extends CacheProvider = CacheProvider>(
    keyspace: string, storage: CacheStorageKey, predicate: (value: V, key: K, provider: P) => unknown | Promise<unknown>
  ): Promise<void> {
    const space = this.keyspaces.get(keyspace)

    if (!space) throw new Error('unknown keyspace')

    if (storage === 'global') {
      for await (const store of space.values()) {
        for await (const data of store.entries()) {
          await predicate(data[1], data[0], this as unknown as P)
        }
      }
    } else {
      const store = space.get(storage)

      if (!store) throw new Error('unknown storage')

      for await (const data of store.entries()) {
        await predicate(data[1], data[0], this as unknown as P)
      }
    }
  }

  async delete<K = string>(keyspace: string, storage: CacheStorageKey, key: K[] | K): Promise<boolean> {
    const space = this.keyspaces.get(keyspace)

    if (!space) throw new Error('unknown keyspace')

    if (storage === 'global') {
      return space.some(store => Array.isArray(key) ? key.every(k => store.delete(k)) : store.delete(key))
    } else {
      const store = space.get(storage)

      if (!store) throw new Error('unknown storage')

      return Array.isArray(key) ? key.every(k => store.delete(k)) : store.delete(key)
    }
  }

  async has<K = string>(keyspace: string, storage: CacheStorageKey, key: K): Promise<boolean> {
    const space = this.keyspaces.get(keyspace)

    if (!space) throw new Error('unknown keyspace')

    if (storage === 'global') {
      return space.some(store => store.has(key))
    } else {
      const store = space.get(storage)

      if (!store) throw new Error('unknown storage')

      return store.has(key)
    }
  }

  async size(keyspace: string, storage: CacheStorageKey): Promise<number> {
    const space = this.keyspaces.get(keyspace)

    if (!space) throw new Error('unknown keyspace')

    if (storage === 'global') {
      return space.reduce((prev, curr) => prev + curr.size, 0)
    } else {
      const store = space.get(storage)

      if (!store) throw new Error('unknown storage')

      return store.size
    }
  }

}
