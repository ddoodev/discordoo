import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { Client } from '@src/core'
import { EntityKey } from '@src/api/entities/interfaces'
import { EntitiesCacheManagerData } from '@src/api/managers/interfaces'
import {
  CacheManagerForEachOptions,
  CacheManagerDeleteOptions,
  CacheManagerFilterOptions,
  CacheManagerCountsOptions,
  CacheManagerSweepOptions,
  CacheManagerCountOptions,
  CacheManagerClearOptions,
  CacheManagerSizeOptions,
  CacheManagerFindOptions,
  CacheManagerGetOptions,
  CacheManagerHasOptions,
  CacheManagerMapOptions,
  CacheManagerSetOptions,
  CacheOptions, CachePointer,
} from '@src/cache/interfaces'
import { CacheProvider, CacheStorageKey } from '@discordoo/providers'

export class EntitiesCacheManager<Entity> extends EntitiesManager {
  private readonly entityKey: EntityKey
  private readonly policy: keyof CacheOptions
  public readonly keyspace: string
  public readonly storage: CacheStorageKey

  constructor(client: Client, data: EntitiesCacheManagerData) {
    super(client)
    this.entityKey = data.entity
    this.keyspace = data.keyspace
    this.storage = data.storage
    this.policy = data.policy ?? 'global'
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

  async get<T = Entity>(key: string, options?: CacheManagerGetOptions): Promise<T | undefined> {
    return this.client.internals.cache.get<string, T>(
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

  async set(key: string, value: Entity | CachePointer, options?: CacheManagerSetOptions): Promise<EntitiesCacheManager<Entity>> {
    const allowed =
      '___type___' in value && value.___type___ === 'discordooCachePointer' || this.entityKey === 'any'
        ? true
        : await this.client.internals.cache[Symbol.for('_ddooPoliciesProcessor')][this.policy](value)

    if (allowed || this.client.options.cache?.global !== undefined) {
      await this.client.internals.cache.set<string, Entity>(
        this.keyspace,
        this.storage,
        this.entityKey,
        key,
        value,
        options,
      )
    } else {
      await this.client.internals.cache.delete<string>(
        this.keyspace,
        options?.storage ?? this.storage,
        key,
        options ? { shard: options?.shard } : undefined
      )
    }

    return this
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

  async clear(options?: CacheManagerClearOptions): Promise<boolean> {
    return this.client.internals.cache.clear(this.keyspace, this.storage, options)
  }

  async count(
    predicate: (value: Entity, key: string, provider: CacheProvider) => (boolean | Promise<boolean>),
    options?: CacheManagerCountOptions
  ): Promise<number> {
    return this.client.internals.cache.count<string, Entity>(this.keyspace, this.storage, this.entityKey, predicate, options)
  }

  async counts(
    predicates: ((value: Entity, key: string, provider: CacheProvider) => (boolean | Promise<boolean>))[],
    options?: CacheManagerCountsOptions
  ): Promise<number[]> {
    return this.client.internals.cache.counts<string, Entity>(this.keyspace, this.storage, this.entityKey, predicates, options)
  }
}
