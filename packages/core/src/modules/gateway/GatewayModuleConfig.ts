/**
 * Configuration for gateway module
 */
export default interface GatewayModuleConfig {
  /**
   * Token, that will be passed to shards
   */
  token: string,
  /**
   * File, which shall be clustered.
   *
   * Should be always default to __filename
   */
  file: string
  /**
   * Shards for this module
   *
   * Double array is for range of shards, array of numbers is for specific shard ids, just number is for total amount of
   * shards
   */
  shards: [number, number] | number[] | number
}
