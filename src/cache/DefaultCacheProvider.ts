import { CacheProvider, Client } from '@src/core'
import { Collection } from '@src/collection'

export class DefaultCacheProvider implements CacheProvider {
  private keyspaces: Collection<string, Collection>
  public client: Client
  public classesCompatible = true
  public sharedCache = false

  constructor(client: Client) {
    this.keyspaces = new Collection()
    this.client = client
  }

  async delete<K = string>(keyspace: string, key: K | K[]): Promise<boolean> {
    const space = this.keyspaces.get(keyspace)

    if (!space) return false

    if (Array.isArray(key)) {
      const results: boolean[] = []

      key.forEach(k => results.push(space.delete(k)))

      return !results.includes(false) // one of keys does not deleted - returning false
    }

    return space.delete(key)
  }

  async get<K = string, V = any>(keyspace: string, key: K): Promise<V | undefined> {
    const space = this.keyspaces.get(keyspace)

    if (!space) return undefined

    return space.get(key) ?? undefined
  }

  async has<K = string>(keyspace: string, key: K): Promise<boolean> {
    const space = this.keyspaces.get(keyspace)

    if (!space) return false

    return space.has(key)
  }

  async set<K = string, V = any>(keyspace: string, key: K, value: V): Promise<DefaultCacheProvider> {
    let space = this.keyspaces.get(keyspace)

    if (!space) space = this.keyspaces.set(keyspace, new Collection()).get(keyspace)!

    return space.set(key, value) && this // returns this
  }

  /**
   * Execute a provided function once for each cache element
   * @param keyspace - keyspace in which to execute
   * @param predicate - function to execute
   * */
  async forEach<K = string, V = any, P extends CacheProvider = CacheProvider>(
    keyspace: string, predicate: (value: V, key: K, provider: P) => unknown
  ): Promise<void> {
    const space = this.keyspaces.get(keyspace)

    if (!space) throw new Error('unknown keyspace') // TODO: rewrite

    space.forEach((value, key) => {
      predicate(value, key, this as unknown as P) // TODO: do something with this
    })
  }

  async init(): Promise<void> {
    setInterval(() => {
      this.keyspaces.forEach((collection, key) => {
        if (collection.size === 0) {
          this.keyspaces.delete(key)
        }
      })
    }, 2 * 60 * 1000)
  }

}
