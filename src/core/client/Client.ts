import { ListenerSignature, TypedEmitter } from 'tiny-typed-emitter'
import { DefaultClientStack } from '@src/core/client/DefaultClientStack'
import { ClientInternals } from '@src/core/client/ClientInternals'
import { ClientOptions } from '@src/core/client/ClientOptions'
import { DiscordooProviders, GlobalCachingPolicy, IpcEvents, IpcOpCodes, REST_DEFAULT_OPTIONS, WS_DEFAULT_OPTIONS } from '@src/constants'
import { DiscordooError, DiscordooSnowflake, resolveDiscordShards, version } from '@src/utils'
import { IpcServer } from '@src/sharding/ipc/IpcServer'
import { GatewayConnectOptions } from '@src/core/providers/gateway/options/GatewayConnectOptions'
import { DefaultCacheProvider } from '@src/cache/DefaultCacheProvider'
import { ProviderConstructor } from '@src/core/providers/ProviderConstructor'
import { DefaultGatewayProvider } from '@src/gateway/DefaultGatewayProvider'
import { DefaultRestProvider } from '@src/rest/DefaultRestProvider'
import { RestManager } from '@src/rest/RestManager'
import { CacheManager } from '@src/cache/CacheManager'
import { GatewayManager } from '@src/gateway/GatewayManager'
import { Final } from '@src/utils/FinalDecorator'
import { ClientShardingMetadata } from '@src/core/client/ClientShardingMetadata'
import { ClientActions } from '@src/core/client/ClientActions'
import { ClientMetadata } from '@src/core/client/ClientMetadata'
import { GuildsManager } from '@src/entities/managers'

/** Entry point for all of Discordoo. */
@Final('start', 'internals', 'guilds')
export class Client<ClientStack extends DefaultClientStack = DefaultClientStack>
  extends TypedEmitter<ListenerSignature<ClientStack['events']>> {
  /** Token used by this client */
  public token: string

  /** Internal things used by this client */
  public internals: ClientInternals<ClientStack>

  /** Options passed to this client */
  public options: ClientOptions

  /** Guilds manager of this client */
  public guilds: GuildsManager

  constructor(token: string, options: ClientOptions = {}) {
    super()

    this.token = token
    this.options = options

    const
      gatewayOptions = Object.assign(WS_DEFAULT_OPTIONS, this.options.gateway ?? {}, { token: this.token }),
      restOptions = Object.assign(REST_DEFAULT_OPTIONS, { auth: `Bot ${this.token}` }, this.options.rest ?? {})

    let
      restProvider: ProviderConstructor<ClientStack['rest']> = DefaultRestProvider,
      cacheProvider: ProviderConstructor<ClientStack['cache']> = DefaultCacheProvider,
      gatewayProvider: ProviderConstructor<ClientStack['gateway']> = DefaultGatewayProvider,
      restProviderOptions = restOptions, gatewayProviderOptions = gatewayOptions, cacheProviderOptions

    const shards = resolveDiscordShards(gatewayProviderOptions.shards || [ 0 ]),
      MANAGER_IPC = process.env.SHARDING_MANAGER_IPC ?? DiscordooSnowflake.generatePartial(),
      INSTANCE_IPC = process.env.SHARDING_INSTANCE_IPC ?? DiscordooSnowflake.generatePartial()

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
      sharding: ClientShardingMetadata = {
        MANAGER_IPC,
        INSTANCE_IPC,
        instance: parseInt(process.env.SHARDING_INSTANCE ?? '0'),
        shards: shards,
        totalShards: shards.length,
        active: DiscordooSnowflake.deconstruct(MANAGER_IPC).shardID === DiscordooSnowflake.SHARDING_MANAGER_ID,
      },
      ipc = new IpcServer(
        this,
        Object.assign({
          instanceIpc: sharding.INSTANCE_IPC,
          managerIpc: sharding.MANAGER_IPC,
          instance: sharding.instance,
        }, this.options.ipc ?? {})
      ),
      actions = new ClientActions(this),
      metadata: ClientMetadata = {
        version,
        shardingUsed: sharding.active,
        restRateLimitsDisabled: restOptions.rateLimits.disable === true,
        restVersion: restOptions.version,
        gatewayVersion: gatewayOptions.version,
        allCacheDisabled: this.options.cache?.global?.policies.includes(GlobalCachingPolicy.NONE) ?? false, // TODO: check all policies
        machinesShardingUsed: false // not supported yet
      }

    this.internals = {
      rest,
      cache,
      gateway,
      sharding,
      ipc,
      actions,
      metadata,
    }

    this.guilds = new GuildsManager(this)
  }

  async start(): Promise<Client<ClientStack>> {
    let options: GatewayConnectOptions | undefined

    if (this.internals.sharding.active) {
      // sharding manager sends to us sharding information (shards - array of shards to serve)
      const { d: { shards, total_shards: totalShards } } = await this.internals.ipc.serve()

      this.internals.sharding.shards = shards
      this.internals.sharding.totalShards = totalShards

      options = {
        shards,
        totalShards,
      }
    }

    await this.internals.gateway.init()
    await this.internals.cache.init()
    await this.internals.rest.init()

    return this.internals.gateway.connect(options)
      .then(async () => {
        if (this.internals.sharding.active) await this.internals.ipc.send({
          op: IpcOpCodes.DISPATCH,
          t: IpcEvents.CONNECTED,
          d: {
            event_id: this.internals.sharding.INSTANCE_IPC,
          }
        })

        return this
      })
      .catch(async e => {
        if (this.internals.sharding.active) await this.internals.ipc.send({
          op: IpcOpCodes.ERROR,
          d: {
            event_id: this.internals.sharding.INSTANCE_IPC,
            error: e
          }
        })

        throw e
      })
  }
}
