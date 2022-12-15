import { TypedEmitter } from 'tiny-typed-emitter'
import { DefaultAbstractApplicationStack } from './interfaces/DefaultAbstractApplicationStack'
import { AbstractApplicationInternals } from './interfaces/AbstractApplicationInternals'
import { AbstractApplicationOptions } from './interfaces/AbstractApplicationOptions'
import { EntitiesUtil } from '@src/api'
import { CompletedGatewayOptions, DefaultGatewayProvider, GatewayManager } from '@src/gateway'
import { CompletedRestOptions, DefaultRestProvider, RestManager } from '@src/rest'
import { CacheManager, CompletedCacheOptions, DefaultCacheProvider } from '@src/cache'
import { CompletedLocalIpcOptions, IpcServerOptions, LocalIpcServer } from '@src/sharding'
import { CompletedClientOptions } from '@src/core/apps/interfaces/ApplicationOptions'
import { ApplicationShardingMetadata, ProviderConstructor } from '@src/core'
import { DiscordooError, DiscordooSnowflake } from '@src/utils'
import { DiscordooProviders } from '@src/constants'
import { LOCAL_IPC_DEFAULT_OPTIONS } from '@src/constants/sharding/IpcDefaultOptions'
import { AbstractApplicationShardingMetadata } from '@src/core/apps/abstract/interfaces/AbstractApplicationShardingMetadata'

export abstract class AbstractDiscordApplication<Stack extends DefaultAbstractApplicationStack = DefaultAbstractApplicationStack>
  // @ts-ignore because events can be redefined, and the typed emitter library doesn't like it. it works anyway.
  extends TypedEmitter<Stack['events']> {

  /** Token used by this app */
  public readonly token: string

  /** Internal things used by this app */
  public readonly internals: AbstractApplicationInternals<Stack>

  /** Options passed to this app */
  public readonly options: AbstractApplicationOptions

  protected constructor(token: string, options: AbstractApplicationOptions = {}) {
    super()

    options.extenders?.forEach(e => {
      EntitiesUtil.extend(e.entity, e.extender)
    })

    this.token = token
    this.options = options

    const cacheOptions: CompletedCacheOptions = this._makeCacheOptions()
    const ipcOptions: CompletedLocalIpcOptions = this._makeLocalIpcOptions()

    let cacheProvider: ProviderConstructor<Stack['cache']> = DefaultCacheProvider, cacheProviderOptions

    const MANAGER_IPC = process.env.SHARDING_MANAGER_IPC ?? DiscordooSnowflake.generatePartial()
    const INSTANCE_IPC = process.env.SHARDING_INSTANCE_IPC ?? DiscordooSnowflake.generatePartial()

    this.options.providers?.forEach(provider => {
      try {
        switch (provider.provide) {
          case DiscordooProviders.Cache:
            cacheProvider = provider.useClass
            cacheProviderOptions = provider.useOptions
            break
        }
      } catch (e) {
        throw new DiscordooError('DiscordApplication#constructor', 'cache provider threw init error:', e)
      }
    })

    const shardingMetadata: ApplicationShardingMetadata = {
      MANAGER_IPC,
      INSTANCE_IPC,
      instance: parseInt(process.env.SHARDING_INSTANCE ?? '0'),
      shards: process.env.SHARDING_SHARDS?.split(',').map(s => parseInt(s)) ?? [ 0 ],
      totalShards: parseInt(process.env.SHARDING_TOTAL ?? '1'),
      active: DiscordooSnowflake.deconstruct(MANAGER_IPC).shardId === DiscordooSnowflake.SHARDING_MANAGER_ID,
    }

    const cache = new CacheManager<Stack['cache']>(
      this,
      cacheProvider,
      { cacheOptions, providerOptions: cacheProviderOptions }
    )
    const ipc = new LocalIpcServer(
      this,
      this._makeIpcServerOptions(ipcOptions, shardingMetadata)
    )
  }

  private _makeCacheOptions(): CompletedCacheOptions {
    return this.options.cache ?? {}
  }

  private _makeLocalIpcOptions(): CompletedLocalIpcOptions {
    return Object.assign(
      {},
      LOCAL_IPC_DEFAULT_OPTIONS,
      this.options.ipc
    )
  }

  private _makeIpcServerOptions(completedOptions: CompletedLocalIpcOptions, metadata: ApplicationShardingMetadata): IpcServerOptions {
    const { MANAGER_IPC, INSTANCE_IPC, instance } = metadata
    return Object.assign(
      {},
      { MANAGER_IPC, INSTANCE_IPC, instance },
      { config: completedOptions }
    )
  }
}