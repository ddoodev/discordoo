/** Client metadata for custom providers and libraries */
export interface ClientMetadata {

  /** Version of the library */
  version: string

  /** Whether sharding used or not */
  shardingUsed: boolean

  /** Whether inter-machines sharding used or not */
  machinesShardingUsed: boolean

  /** Whether client running without any cache */
  allCacheDisabled: boolean

  /** Whether built-in rate-limiter disabled or not */
  restRateLimitsDisabled: boolean

  /** Discord Rest API version used by this client */
  restVersion: number

  /** Discord Gateway version used by this client */
  gatewayVersion: number

}
