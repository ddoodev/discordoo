/**
 * Configuration for gateway module
 */
export default interface GatewayModuleConfig {
  /**
   * Shards for this module
   *
   * Double array is for range of shards, array of numbers is for specific shard ids, just number is for total amount of
   * shards
   */
  shards?: [number, number] | number[] | number
}
