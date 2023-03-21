/** Abstract application metadata for custom providers and libraries */
export interface CacheApplicationMetadata {
  /** Version of the library */
  version: string

  /** Whether sharding used or not */
  shardingUsed: boolean

  /** Whether inter-machines sharding used or not */
  machinesShardingUsed: boolean

  /** Whether app running without any cache */
  allCacheDisabled: boolean
}