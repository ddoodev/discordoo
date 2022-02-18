import { ShardListResolvable } from '@src/utils'
import { GatewayIntentsResolvable } from '@src/gateway/interfaces/GatewayIntentsResolvable'
import { PresenceUpdateData } from '@src/api'

export interface GatewayOptions {

  /** Authentication token. */
  token: string

  /**
   * Connection properties.
   * @see https://discord.com/developers/docs/topics/gateway#identify-identify-connection-properties
   * */
  properties: any // TODO

  /**
   * Whether this connection supports compression of packets.
   *
   * @default false
   * */
  compress?: boolean

  /**
   * Value between 50 and 250, total number of members where the gateway will stop sending
   * offline members in the guild member list.
   *
   * @default 50
   * */
  largeThreshold?: number

  /**
   * Presence structure for initial presence information.
   *
   * @see https://discord.com/developers/docs/topics/gateway#update-status
   * */
  presence?: PresenceUpdateData
  /**
   * The Gateway Intents you wish to receive
   *
   * @see https://discord.com/developers/docs/topics/gateway#gateway-intents
   * @default 32509, all intents expect privileged
   * */
  intents?: GatewayIntentsResolvable

  /**
   * If number is provided - WS will create X shards from 0 to X - 1 (3 = 0, 1, 2).
   * If auto is provided, shards amount will be fetched from Discord.
   * If array of numbers is provided, the library will interpret it as IDs of shards to create.
   *
   * @default 1
   * */
  shards?: ShardListResolvable

  /** Maximum amount of shards that can be spawned by the {@link WebSocketManager}. */
  // might be useless, because it can be calculated from all values of shards
  maxShards?: number

  /**
   * Used by the library internals for correct interprocess sharding.
   * Can be used for client clustering.
   * */
  totalShards?: number

  /**
   * Version of gateway to use.
   *
   * @default 9
   * */
  version?: number

  /**
   * Gateway URL.
   *
   * @default wss://gateway.discord.gg/
   * */
  url?: string

  /**
   * Waiting time between shards launches, in ms.
   *
   * @default calculates from 5000 / session_start_limit.max_concurrency
   * */
  spawnDelay?: number

  /**
   * Encoding to use in WebSocket connection. Detected automatically (etf when found erlpack, else json),
   * but can be overwritten using this option.
   *
   * @default json
   * */
  encoding?: 'json' | 'etf'

  /**
   * Use reconnect instead of resume,
   * because when client resumed Discord will send a ton of missed events in one second
   * and this may lead to violations of the rate limits.
   *
   * @see https://discord.com/developers/docs/topics/gateway#resuming
   * @default false
   * */
  useReconnectOnly?: boolean

  /**
   * Smooth events peaks. When we usually receive 100 events per second,
   * and suddenly we got 10000 events per second, library will emit these events gradual:
   * from 100 events/s, to 200, then to 400, 800, 1600 etc.
   * This may be helpful to smooth out the load on the server and on the rate limits.
   *
   * @default false
   * */
  smoothEventsPeaks?: boolean

  /**
   * Use custom multiplier for smoothing events peaks.
   * When multiplier is 2 (default), library will double the number of events allowed per second every smooth:
   * from 100 to 200, from 200 to 400, 800, 1600 etc.
   * When multiplier is 1.5 for example, library will increase the number of events allowed per second by 1.5:
   * from 100 to 150, from 150 to 225, from 225 to 337.5 (338), 507, 760.5 (761) etc.
   *
   * @default 2
   * */
  eventPeaksSmoothingMultiplier?: number

  /**
   * Number of events which library can emit in 1 second.
   * If limit is reached, library will add events to queue and will emit them later.
   *
   * @default Infinity
   * */
  maxEventsPerSecond?: number

  /**
   * The time it takes for a response from Discord to arrive when the client connects to it, in ms
   * */
  handshakeTimeout?: number
}
