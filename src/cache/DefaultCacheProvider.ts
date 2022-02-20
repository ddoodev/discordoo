import { Client } from '@src/core'
import { Collection } from '@discordoo/collection'
import { CacheStorageKey, CacheProvider } from '@discordoo/providers'

export class DefaultCacheProvider implements CacheProvider {
  private keyspaces: Collection<string, Collection<string, Collection>>

  public client: Client
  public compatible: 'classes' | 'json' | 'text' | 'buffer' = 'classes'
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

    if (!space) return undefined

    if (storage === 'global') {
      let result

      space.forEach(store => {
        const r = store.get(key)
        if (r) result = r
      })

      return result
    } else {
      const store = space.get(storage)

      if (!store) return undefined

      return store.get(key)
    }
  }

  async forEach<K = string, V = any, P extends CacheProvider = CacheProvider>(
    keyspace: string, storage: CacheStorageKey, predicate: (value: V, key: K, provider: P) => unknown | Promise<unknown>
  ): Promise<void> {
    const space = this.keyspaces.get(keyspace)

    if (!space) return undefined

    if (storage === 'global') {
      for await (const store of space.values()) {
        for await (const data of store.entries()) {
          await predicate(data[1], data[0], this as unknown as P)
        }
      }
    } else {
      const store = space.get(storage)

      if (!store) return undefined

      for await (const data of store.entries()) {
        await predicate(data[1], data[0], this as unknown as P)
      }
    }
  }

  async delete<K = string>(keyspace: string, storage: CacheStorageKey, key: K[] | K): Promise<boolean> {
    const space = this.keyspaces.get(keyspace)

    if (!space) return false

    if (storage === 'global') {
      return space.some(store => Array.isArray(key) ? key.every(k => store.delete(k)) : store.delete(key))
    } else {
      const store = space.get(storage)

      if (!store) return false

      return Array.isArray(key) ? key.every(k => store.delete(k)) : store.delete(key)
    }
  }

  async has<K = string>(keyspace: string, storage: CacheStorageKey, key: K): Promise<boolean> {
    const space = this.keyspaces.get(keyspace)

    if (!space) return false

    if (storage === 'global') {
      return space.some(store => store.has(key))
    } else {
      const store = space.get(storage)

      if (!store) return false

      return store.has(key)
    }
  }

  async size(keyspace: string, storage: CacheStorageKey): Promise<number> {
    const space = this.keyspaces.get(keyspace)

    if (!space) return 0

    if (storage === 'global') {
      return space.reduce((prev, curr) => prev + curr.size, 0)
    } else {
      const store = space.get(storage)

      if (!store) return 0

      return store.size
    }
  }

  async keys<K = string>(keyspace: string, storage: CacheStorageKey): Promise<K[]> {
    const space = this.keyspaces.get(keyspace)

    if (!space) return []

    if (storage === 'global') {
      return space.reduce<any[]>((accumulator, value) => {
        accumulator.push(...Array.from(value.keys()))
        return accumulator
      }, [])
    } else {
      const store = space.get(storage)

      if (!store) return []

      return Array.from(store.keys())
    }
  }

  async values<V = any>(keyspace: string, storage: CacheStorageKey): Promise<V[]> {
    const space = this.keyspaces.get(keyspace)

    if (!space) return []

    if (storage === 'global') {
      return space.reduce<any[]>((accumulator, value) => {
        accumulator.push(...Array.from(value.values()))
        return accumulator
      }, [])
    } else {
      const store = space.get(storage)

      if (!store) return []

      return Array.from(store.values())
    }
  }

  async entries<K = string, V = any>(keyspace: string, storage: CacheStorageKey): Promise<Array<[ K, V ]>> {
    const space = this.keyspaces.get(keyspace)

    if (!space) return []

    if (storage === 'global') {
      return space.reduce<any[]>((accumulator, value) => {
        accumulator.push(...Array.from(value.entries()))
        return accumulator
      }, [])
    } else {
      const store = space.get(storage)

      if (!store) return []

      return Array.from(store.entries())
    }
  }

}
