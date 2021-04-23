import { GatewayIdentifyData } from 'discord-api-types'

export default interface GatewayOptions extends GatewayIdentifyData {
  /**
   * If number is provided - WS will create X shards
   * If auto is provided, shards amount will be fetched from Discord
   * If array of numbers is provided, the library will interpret it as IDs of shards to be spawned
   */
  shards?: number | number[] | 'auto'
  /** Maximum amount of shards that can be spawned by the {@link WSClient} */
  maxShards?: number,
  /**
   * Version of gateway to use
   * @note Only 8 is supported for know. Once next version is released, v8 will be left for legacy support.
   * */
  version?: 8,
  /** Gateway URL */
  url?: string,
  /** Payload compression is not supported by Discordoo */
  compress?: false | undefined
  /** Encoding */
  encoding?: 'json' | 'etf'
  /** Use transport compress */
  transportCompress: 'zlib-sync' | undefined
}