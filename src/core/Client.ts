import { ListenerSignature, TypedEmitter } from 'tiny-typed-emitter'
import ModuleManager from '@src/core/modules/ModuleManager'
import Module from '@src/core/modules/Module'
import RESTProvider from '@src/core/providers/rest/RESTProvider'
import CacheProvider from '@src/core/providers/cache/CacheProvider'
import DefaultClientStack from '@src/core/client/DefaultClientStack'
import GatewayProvider from '@src/core/providers/gateway/GatewayProvider'
import ClientInternals from '@src/core/client/ClientInternals'
import ClientOptions from '@src/core/client/ClientOptions'
import { RESTProviderBuilder } from '@src/rest'
import { CacheProviderBuilder } from '@src/cache'
import GatewayProviderBuilder from '@src/gateway/GatewayProviderBuilder'
import { DiscordooProviders } from '@src/core/Constants'
import { DiscordooError, DiscordooSnowflake } from '@src/utils'
import IpcServer from '@src/sharding/ipc/IpcServer'
import ShardingClientEnvironment from '@src/sharding/interfaces/client/ShardingClientEnvironment'
import GatewayConnectOptions from '@src/gateway/interfaces/GatewayConnectOptions'

/** Entry point for all of Discordoo. Manages modules and events */
export default class Client<ClientStack extends DefaultClientStack = DefaultClientStack>
  extends TypedEmitter<ListenerSignature<ClientStack['events']>> {
  /** Token used by this client */
  public token: string

  /** Module manager of this client */
  public modules: ModuleManager = new ModuleManager(this)

  /** Internal things used by this client */
  public internals: ClientInternals<ClientStack>

  /** Options passed to this client */
  public options: ClientOptions

  constructor(token: string, options: ClientOptions = {}) {
    super()

    this.token = token
    this.options = options

    let rest: RESTProvider<ClientStack['rest']> = new RESTProviderBuilder(this.options.rest).getRestProvider()(this),
      cache: CacheProvider<ClientStack['cache']> = new CacheProviderBuilder().getCacheProvider()(this),
      gateway: GatewayProvider<ClientStack['gateway']> = new GatewayProviderBuilder(
        Object.assign(this.options.gateway ?? {}, { token: this.token })
      ).getGatewayProvider()(this)

    this.options.providers?.forEach(provider => {
      try {
        switch (provider.provide) {
          case DiscordooProviders.CACHE:
            cache = provider.use<CacheProvider>(this).bind(this)
            break

          case DiscordooProviders.GATEWAY:
            gateway = provider.use<GatewayProvider>(this).bind(this)
            break

          case DiscordooProviders.REST:
            rest = provider.use<RESTProvider>(this).bind(this)
            break
        }
      } catch (e) {
        throw new DiscordooError('Client#constructor', 'one of providers threw error when initialized:', e)
      }
    })

    const env: ShardingClientEnvironment = {
      SHARD_IPC_IDENTIFIER: process.env.__DDOO_SHARD_IPC_IDENTIFIER!,
      SHARDING_MANAGER_IPC_IDENTIFIER: process.env.__DDOO_SHARDING_MANAGER_IPC_IDENTIFIER!,
      SHARD_ID: parseInt(process.env.__DDOO_SHARD_ID!) ?? 0
    }

    const ipc = new IpcServer(
      Object.assign({
        id: env.SHARD_IPC_IDENTIFIER || DiscordooSnowflake.generate(env.SHARD_ID, process.pid),
        managerIpcId: env.SHARDING_MANAGER_IPC_IDENTIFIER,
        shardId: env.SHARD_ID
      }, this.options.ipc ?? {})
    )

    this.internals = {
      rest,
      cache,
      gateway,
      ipc,
      env,
    }

    if (this.options.root) this.use(this.options.root)
  }

  /**
   * Get a module. Alias for module(id).
   * @param id - module id
   */
  m(id: string | symbol): Module | null {
    return this.module(id)
  }

  /**
   * Get a module
   * @param id - module id
   */
  module(id: string | symbol): Module | null {
    return this.modules.getModule(id) ?? null
  }

  /**
   * Create a new module load group
   * @param modules - modules in the group
   */
  use(...modules: Module[]) {
    this.modules.use(...modules)
  }

  /**
   * Set the {@link RESTProvider} to be used by this client
   * Bounds it's context to {@link Client}
   * @param provider - function, that returns desired RESTProvider
   */
  useRESTProvider(provider: (client: Client) => RESTProvider<ClientStack['rest']>) {
    this.internals.rest = provider(this).bind(this)
  }

  /**
   * Set the {@link CacheProvider} to be used by this client
   * Bounds it's context to {@link Client}
   * @param provider - function, that returns desired CacheProvider
   */
  useCacheProvider(provider: (client: Client) => CacheProvider<ClientStack['cache']>) {
    this.internals.cache = provider(this).bind(this)
  }

  /**
   * Set the {@link CacheProvider} to be used by this client
   * Bounds it's context to {@link Client}
   * @param provider - function, that returns desired CacheProvider
   */
  useGatewayProvider(provider: (client: Client) => GatewayProvider<ClientStack['gateway']>) {
    this.internals.gateway = provider(this).bind(this)
  }

  async start() {
    let options: GatewayConnectOptions

    if (this.internals.env.SHARDING_MANAGER_IPC_IDENTIFIER) {
      await this.internals.ipc.serve()
      if (this.internals.ipc.shards && this.internals.ipc.totalShards) {
        options = {
          totalShards: this.internals.ipc.totalShards,
          shards: this.internals.ipc.shards
        }
      }
    }

    await this.internals.gateway().connect(options!)
  }
}
