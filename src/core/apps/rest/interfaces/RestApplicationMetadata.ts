import { CacheApplicationMetadata } from '../../../../../src/core'

export interface RestApplicationMetadata extends CacheApplicationMetadata {
  /** Whether built-in rate-limiter disabled or not */
  restRateLimitsDisabled: boolean

  /** Discord Rest API version used by this app */
  restVersion: number
}