import { EntitiesManager } from '@src/entities/managers/EntitiesManager'
import { CacheProvider, Client } from '@src/core'
import { EntityKey } from '@src/entities'
import {
  CacheManagerForEachOptions,
  CacheManagerDeleteOptions,
  CacheManagerFilterOptions,
  CacheManagerSweepOptions,
  CacheManagerSizeOptions,
  CacheManagerFindOptions,
  CacheManagerGetOptions,
  CacheManagerHasOptions,
  CacheManagerMapOptions,
  CacheManagerSetOptions,
  CacheStorageKey
} from '@src/cache/interfaces'

export class EntitiesCacheManager<Entity, EntityData = any> extends EntitiesManager {
  private readonly entityKey: EntityKey
  public readonly keyspace: string
  public readonly storage: CacheStorageKey

  constructor(client: Client, entityKey: EntityKey, keyspace: string, storage: CacheStorageKey) {
    super(client)
    this.entityKey = entityKey
    this.keyspace = keyspace
    this.storage = storage
  }

  async delete(key: string[] | string, options?: CacheManagerDeleteOptions): Promise<boolean> {
    return this.client.internals.cache.delete<string>(this.keyspace, this.storage, key, options)
  }

  async filter(
    predicate: (value: Entity, key: string, provider: CacheProvider) => (boolean | Promise<boolean>),
    options?: CacheManagerFilterOptions
  ): Promise<Array<[ string, Entity ]>> {
    return this.client.internals.cache.filter<string, Entity>(
      this.keyspace,
      this.storage,
      this.entityKey,
      predicate,
      options,
    )
  }

  async find(
    predicate: (value: Entity, key: string, provider: CacheProvider) => (boolean | Promise<boolean>),
    options?: CacheManagerFindOptions
  ): Promise<Entity | undefined> {
    return this.client.internals.cache.find<string, Entity>(
      this.keyspace,
      this.storage,
      this.entityKey,
      predicate,
      options,
    )
  }

  async forEach(
    predicate: (value: Entity, key: string, provider: CacheProvider) => (unknown | Promise<unknown>),
    options?: CacheManagerForEachOptions
  ): Promise<void> {
    return this.client.internals.cache.forEach<string, Entity>(
      this.keyspace,
      this.storage,
      this.entityKey,
      predicate,
      options,
    )
  }

  async get(key: string, options?: CacheManagerGetOptions): Promise<Entity | undefined> {
    return this.client.internals.cache.get<string, Entity>(
      this.keyspace,
      this.storage,
      this.entityKey,
      key,
      options,
    )
  }

  async has(key: string, options?: CacheManagerHasOptions): Promise<boolean> {
    return this.client.internals.cache.has<string>(
      this.keyspace,
      this.storage,
      key,
      options,
    )
  }

  async map<R>(
    predicate: (value: Entity, key: string, provider: CacheProvider) => (R | Promise<R>),
    options?: CacheManagerMapOptions
  ): Promise<R[]> {
    return this.client.internals.cache.map<string, Entity, R>(
      this.keyspace,
      this.storage,
      this.entityKey,
      predicate,
      options,
    )
  }

  async set(key: string, value: Entity, options?: CacheManagerSetOptions): Promise<EntitiesCacheManager<Entity, EntityData>> {
    return await this.client.internals.cache.set<string, Entity>(
      this.keyspace,
      this.storage,
      this.entityKey,
      key,
      value,
      options,
    ) && this // returns this
  }

  async size(options?: CacheManagerSizeOptions): Promise<number> {
    return this.client.internals.cache.size(this.keyspace, this.storage, options)
  }

  async sweep(
    predicate: (value: Entity, key: string, provider: CacheProvider) => (boolean | Promise<boolean>),
    options?: CacheManagerSweepOptions
  ): Promise<void> {
    return this.client.internals.cache.sweep<string, Entity>(
      this.keyspace,
      this.storage,
      this.entityKey,
      predicate,
      options,
    )
  }
}
