/**
 * Configuration for gateway module
 */
export default interface GatewayModuleConfig {
  /**
   * File, which shall be clustered.
   *
   * Should be always default to __filename
   */
  file?: string
  /**
   * Shards for this module
   *
   * Array of numbers is for specific shard ids, just number is for total amount of shards
   */
  shards?: number[] | number
}
