import { ListenerSignature, TypedEmitter } from 'tiny-typed-emitter'
import { DefaultClientStack } from '@src/core/client/DefaultClientStack'
import { ClientInternals } from '@src/core/client/ClientInternals'
import { ClientOptions } from '@src/core/client/ClientOptions'
import { DiscordooProviders } from '@src/core/Constants'
import { DiscordooError, DiscordooSnowflake } from '@src/utils'
import { IpcServer } from '@src/sharding/ipc/IpcServer'
import { ShardingClientEnvironment } from '@src/sharding/interfaces/client/ShardingClientEnvironment'
import { GatewayConnectOptions } from '@src/core/providers/gateway/options/GatewayConnectOptions'
import { DefaultCacheProvider } from '@src/cache/DefaultCacheProvider'
import { ProviderConstructor } from '@src/core/providers/ProviderConstructor'
import { DefaultGatewayProvider } from '@src/gateway/DefaultGatewayProvider'
import { DefaultRestProvider } from '@src/rest/DefaultRestProvider'

/** Entry point for all of Discordoo. Manages modules and events */
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

    let rest: ClientStack['rest'] = new DefaultRestProvider(this),
      cache: ClientStack['cache'] = new DefaultCacheProvider(this),
      gateway: ClientStack['gateway'] = new DefaultGatewayProvider(this, gatewayOptions)

    this.options.providers?.forEach(provider => {
      try {
        switch (provider.provide) {
          case DiscordooProviders.CACHE:
            cache = new provider.useClass(this)
            break

          case DiscordooProviders.GATEWAY:
            gateway = new provider.useClass(this, gatewayOptions)
            break

          case DiscordooProviders.REST:
            rest = new provider.useClass(this)
            break
        }
      } catch (e) {
        throw new DiscordooError('Client#constructor', 'one of providers threw error when initialized:', e)
      }
    })

    const env: ShardingClientEnvironment = {
      SHARDING_MANAGER_IPC_ID: process.env.__DDOO_SHARDING_MANAGER_IPC_ID!,
      SHARDING_INSTANCE_IPC_ID: process.env.__DDOO_SHARDING_INSTANCE_IPC_ID!,
      SHARDING_INSTANCE_ID: parseInt(process.env.__DDOO_SHARDING_INSTANCE_ID!) ?? 0
    }

    const ipc = new IpcServer(
      Object.assign({
        id: env.SHARDING_INSTANCE_IPC_ID || DiscordooSnowflake.generate(env.SHARDING_INSTANCE_ID, process.pid),
        managerIpcId: env.SHARDING_MANAGER_IPC_ID,
        shardId: env.SHARDING_INSTANCE_ID
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

  /**
   * Set the {@link RestProvider} to be used by this client
   * @param provider - function, that returns desired RESTProvider
   * @param options - any options to custom cache provider
   */
  useRESTProvider(provider: ProviderConstructor<ClientStack['rest']>, ...options: any[]) {
    this.internals.rest = new provider(this, ...options)
  }

  /**
   * Set the {@link CacheProvider} to be used by this client
   * @param provider - class that implements {@link CacheProvider}
   * @param options - any options to custom cache provider
   */
  useCacheProvider(provider: ProviderConstructor<ClientStack['cache']>, ...options: any[]) {
    this.internals.cache = new provider(this, ...options)
  }

  /**
   * Set the {@link GatewayProvider} to be used by this client
   * @param provider - class that implements {@link GatewayProvider}
   * @param options - any options to custom gateway provider
   */
  useGatewayProvider(provider: ProviderConstructor<ClientStack['gateway']>, ...options: any[]) {
    this.internals.gateway = new provider(this, ...options)
  }

  async start() {
    let options: GatewayConnectOptions | undefined

    if (this.internals.env.SHARDING_MANAGER_IPC_ID) {
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
