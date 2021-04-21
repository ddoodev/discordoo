import { GatewayIdentifyData } from 'discord-api-types'

export default interface GatewayOptions extends GatewayIdentifyData {
  /**
   * If number is provided - WS will create X shards
   * If auto is provided, shards amount will be fetched from Discord
   * If array of numbers is provided, the library will interpret it as IDs of shards to be spawned
   */
  shards?: number | number[] | 'auto'
  /** Maximum amount of shards that can be spawned by the {@link WSClient} */
  maxShards?: number
}