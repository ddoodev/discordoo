import { ListenerSignature, TypedEmitter } from 'tiny-typed-emitter'
import { DefaultClientStack } from '@src/core/client/DefaultClientStack'
import { ClientInternals } from '@src/core/client/ClientInternals'
import { ClientOptions } from '@src/core/client/ClientOptions'
import { DiscordooProviders } from '@src/core/Constants'
import { DiscordooError, DiscordooSnowflake } from '@src/utils'
import { IpcServer } from '@src/sharding/ipc/IpcServer'
import { ShardingInstanceEnvironment } from '@src/sharding/interfaces/client/ShardingInstanceEnvironment'
import { GatewayConnectOptions } from '@src/core/providers/gateway/options/GatewayConnectOptions'
import { DefaultCacheProvider } from '@src/cache/DefaultCacheProvider'
import { ProviderConstructor } from '@src/core/providers/ProviderConstructor'
import { DefaultGatewayProvider } from '@src/gateway/DefaultGatewayProvider'
import { DefaultRestProvider } from '@src/rest/DefaultRestProvider'
import { RestManager } from '@src/rest/RestManager'
import { CacheManager } from '@src/cache/CacheManager'
import { GatewayManager } from '@src/gateway/GatewayManager'
import { Final } from '@src/utils/FinalDecorator'

/** Entry point for all of Discordoo. Manages modules and events */
@Final('start', 'internals')
export class Client<ClientStack extends DefaultClientStack = DefaultClientStack>
  extends TypedEmitter<ListenerSignature<ClientStack['events']>> {
  /** Token used by this client */
  public token: string

  /** Internal things used by this client */
  public internals: ClientInternals<ClientStack>

  /** Options passed to this client */
  public options: ClientOptions

  constructor(token: string, options: ClientOptions = {}) {
    super()

    this.token = token
    this.options = options

    const gatewayOptions = Object.assign({}, this.options.gateway || {}, { token: this.token })

    let
      restProvider: ProviderConstructor<ClientStack['rest']> = DefaultRestProvider,
      cacheProvider: ProviderConstructor<ClientStack['cache']> = DefaultCacheProvider,
      gatewayProvider: ProviderConstructor<ClientStack['gateway']> = DefaultGatewayProvider,
      restProviderOptions, gatewayProviderOptions = gatewayOptions, cacheProviderOptions

    this.options.providers?.forEach(provider => {
      try {
        switch (provider.provide) {
          case DiscordooProviders.CACHE:
            cacheProvider = provider.useClass
            cacheProviderOptions = provider.useOptions
            break

          case DiscordooProviders.GATEWAY:
            gatewayProvider = provider.useClass
            gatewayProviderOptions = provider.useOptions
            break

          case DiscordooProviders.REST:
            restProvider = provider.useClass
            restProviderOptions = provider.useOptions
            break
        }
      } catch (e) {
        throw new DiscordooError('Client#constructor', 'one of providers threw error when initialized:', e)
      }
    })

    const
      rest = new RestManager<ClientStack['rest']>(this, restProvider, { provider: restProviderOptions }),
      cache = new CacheManager<ClientStack['cache']>(this, cacheProvider, { provider: cacheProviderOptions }),
      gateway = new GatewayManager<ClientStack['gateway']>(this, gatewayProvider, { provider: gatewayProviderOptions }),
      env: ShardingInstanceEnvironment = {
        SHARDING_MANAGER_IPC: process.env.SHARDING_MANAGER_IPC!,
        SHARDING_INSTANCE_IPC: process.env.SHARDING_INSTANCE_IPC!,
        SHARDING_INSTANCE: parseInt(process.env.SHARDING_INSTANCE!) || 0
      },
      ipc = new IpcServer(
        Object.assign({
          id: env.SHARDING_INSTANCE_IPC || DiscordooSnowflake.generate(env.SHARDING_INSTANCE, process.pid),
          managerIpcId: env.SHARDING_MANAGER_IPC,
          shardId: env.SHARDING_INSTANCE
        }, this.options.ipc ?? {})
      )

    this.internals = {
      rest,
      cache,
      gateway,
      ipc,
      env,
    }
  }

  async start() {
    let options: GatewayConnectOptions | undefined

    console.log(this)

    if (this.internals.env.SHARDING_MANAGER_IPC) {
      await this.internals.ipc.serve()
      if (this.internals.ipc.shards && this.internals.ipc.totalShards) {
        options = {
          totalShards: this.internals.ipc.totalShards,
          shards: this.internals.ipc.shards
        }
      }
    }

    await this.internals.gateway.connect(options)
  }
}
