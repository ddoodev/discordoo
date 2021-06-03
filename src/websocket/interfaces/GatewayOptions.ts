import { GatewayIdentifyData } from 'discord-api-types'

export default interface GatewayOptions extends GatewayIdentifyData {
  /**
   * If number is provided - WS will create X shards from 0 to X-1 (3 = 0, 1, 2)
   * If auto is provided, shards amount will be fetched from Discord
   * If array of numbers is provided, the library will interpret it as IDs of shards to create
   */
  shards?: number | number[] | 'auto'

  /** Maximum amount of shards that can be spawned by the {@link WebSocketManager} */
  // might be useless, because it can be calculated from all values of shards
  maxShards?: number

  /** Version of gateway to use */
  version?: number

  /** Gateway URL */
  url?: string

  /** Waiting time between shards launches, in ms */
  spawnDelay?: number

  /** Encoding to use in WebSocket connection. Detected automatically (etf when found erlpack, else json),
   * but can be overwritten using this option.
   */
  encoding?: 'json' | 'etf'

  /** Use reconnect instead of resume,
   * because when client resumed Discord will send a ton of missed events in one second and
   * this may lead to violations of the rate limits.
   * @see https://discord.com/developers/docs/topics/gateway#resuming */
  useReconnectOnly?: boolean

  /** Smooth events peaks. When we usually receive 100 events per second,
   * and suddenly we got 10000 events per second, library will emit these events gradual:
   * from 100 events/s, to 200, then to 400, 800, 1600 etc.
   * This may be helpful to smooth out the load on the server and on the rate limits. */
  smoothEventsPeaks?: boolean

  /** Use custom multiplier for smoothing events peaks.
   * When multiplier is 2 (default), library will double the number of events allowed per second every smooth:
   * from 100 to 200, from 200 to 400, 800, 1600 etc.
   * When multiplier is 1.5 for example, library will increase the number of events allowed per second by 1.5:
   * from 100 to 150, from 150 to 225, from 225 to 337.5 (338), 507, 760.5 (761) etc. */
  eventPeaksSmoothingMultiplier?: number

  /** Number of events which library can emit in 1 second.
   * If limit is reached, library will add events to queue and will emit them later. */
  maxEventsPerSecond?: number
}
