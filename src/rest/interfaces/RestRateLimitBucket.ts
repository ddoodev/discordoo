import { RestManagerRequestData } from '@src/rest'

export interface RestRateLimitBucket {
  /** Bucket hash (unique id) */
  hash: string
  /** The number of requests that can be made */
  limit: number
  /** The number of remaining requests that can be made */
  remaining: number
  /** Reset in time (in ms) */
  resetAfter: number
  /** Reset time (epoch, in ms) */
  resetTime: number
  /** Requests queue */
  queue: RestManagerRequestData[]
}