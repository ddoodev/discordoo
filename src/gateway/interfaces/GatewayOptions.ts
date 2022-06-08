import { ReplaceType, ShardListResolvable } from '@src/utils'
import { GatewayIntentsResolvable } from '@src/gateway/interfaces/GatewayIntentsResolvable'
import { PresenceUpdateData } from '@src/api'
import { GatewayIdentifyProperties } from '@src/gateway/interfaces/GatewayIdentifyProperties'

/** Options for client's gateway connection */
export interface GatewayOptions {
  /** Authentication token */
  token?: string
  /**
   * Presence structure for initial presence information
   * @see https://discord.com/developers/docs/topics/gateway#update-status
   * */
  presence?: PresenceUpdateData
  /**
   * The Gateway Intents you wish to receive
   * @see https://discord.com/developers/docs/topics/gateway#gateway-intents
   * @default IntentsUtil.NON_PRIVILEGED_NUMERIC
   * */
  intents?: GatewayIntentsResolvable
  /** Options for gateway sharding */
  sharding?: GatewayShardingOptions
  /** Options for gateway connection */
  connection?: GatewayConnectionOptions
  /** Options for gateway events processing */
  events?: GatewayEventsOptions
}

/** Options for gateway events processing */
export interface GatewayEventsOptions {
  /**
   * When this option is enabled, gateway will automatically smooth out peak loads by postponing events emit.
   *
   * When we usually receive 100 events per second,
   * and suddenly we got 10000 events per second, library will emit these events gradual:
   * from 100 events/s, to 200, then to 400, 800, 1600 etc.
   * This may be helpful to smooth out the load on the server and on the rate limits.
   *
   * THIS WILL NOT WORK ON `ROLE_UPDATE` EVENTS.
   * @default false
   * */
  loadDistribution?: boolean
  /**
   * Use custom multiplier for smoothing events peaks.
   * When multiplier is 2 (default), library will double the number of events allowed per second every smooth:
   * from 100 to 200, from 200 to 400, 800, 1600 etc.
   * When multiplier is 1.5 for example, library will increase the number of events allowed per second by 1.5:
   * from 100 to 150, from 150 to 225, from 225 to 337.5 (338), 507, 760.5 (761) etc.
   * @default 2
   * */
  loadDistributionMultiplier?: number
  /**
   * Number of events which library can emit in 1 second.
   * If limit is reached, library will add events to queue and will emit them later.
   * @default Infinity
   * */
  secondLimit?: number
}

/** Options for gateway sharding */
export interface GatewayShardingOptions {
  /**
   * Shards to serve.
   *
   * If number is provided - WS will create X shards from 0 to X - 1 (3 = 0, 1, 2).
   * If auto is provided, shards amount will be fetched from Discord.
   * If array of numbers is provided, the library will interpret it as IDs of shards to create
   * @default 1 or provided by sharding manager
   * */
  shards?: ShardListResolvable
  /**
   * The number of shards that this client has. Includes all processes, all hosting servers, etc.
   *
   * Used by the library internals for correct interprocess sharding.
   * Can be used for client clustering.
   * @default calculated automatically or provided by sharding manager
   * */
  totalShards?: number
}

/** Options for gateway connection */
export interface GatewayConnectionOptions {
  /**
   * Connection properties
   * @see https://discord.com/developers/docs/topics/gateway#identify-identify-connection-properties
   * */
  properties?: GatewayIdentifyProperties
  /**
   * The maximum time to connect to Discord, in milliseconds.
   * If it fails to connect within this time, the gateway will throw an error
   * @default 30 000
   * */
  handshakeTimeout?: number
  /**
   * Whether this connection supports compression of packets
   * @default false
   * */
  compress?: boolean
  /**
   * Value between 50 and 250, total number of members where the gateway will stop sending
   * offline members in the guild member list
   * @default 50
   * */
  largeThreshold?: number
  /**
   * Version of gateway to use.
   * @default 10
   * */
  version?: number
  /**
   * Gateway URL.
   * @default wss://gateway.discord.gg/
   * */
  url?: string
  /**
   * Encoding to use in WebSocket connection. Detected automatically,
   * but can be overwritten using this option.
   * @default etf when erlpack found, else json
   * */
  encoding?: 'json' | 'etf'
}

export interface CompletedGatewayOptions {
  token: string
  presence: PresenceUpdateData
  intents: number
  sharding: ReplaceType<Required<GatewayShardingOptions>, 'shards', number[]>
  connection: Required<GatewayConnectionOptions>
  events: Required<GatewayEventsOptions>
}