import { Client } from '@src/core'
import { Collection } from '@discordoo/collection'
import { RestManagerRequestData } from '@src/rest/interfaces'
import { RestRateLimitBucket } from '@src/rest/interfaces/RestRateLimitBucket'

/**
 * It is used to comply with the rate limits of Discord.
 *
 * How it works:
 *
 * */
export class RestLimitsManager {
  public client: Client

  private allowedRequests = 50
  private allowedInvalidRequests = 10_000
  private resetInterval?: ReturnType<typeof setInterval>

  private queue: RestManagerRequestData[] = []
  private hashes = new Collection<string, string>()
  private buckets = new Collection<string, RestRateLimitBucket>()

  /** Requests executed for the current second */
  public requestsExecutedNow = 0
  /** Requests executed for the previous second */
  public requestsExecutedPeriod = 0
  /** Requests executed total */
  public requestsExecuted = 0

  public locked = false

  constructor(client: Client) {
    this.client = client
  }



  private bucket(request: RestManagerRequestData): RestRateLimitBucket | undefined {
    const hash = this.hashes.get(`${request.method}://${request.path}`)

    if (hash) {
      if (hash === 'unlimited') return undefined

      return this.buckets.get(`${request.majorParameter ?? 'unknown'}+${hash}`)
    }
  }

  async init() {
    if (!this.client.internals.sharding.active) {
      let remaining = 10 * 60 * 1000 // 10 minutes, in ms

      /**
       * This interval will reset allowed requests/s every second
       * and also it will reset allowed invalid requests/10m every 10 minutes
       * */
      this.resetInterval = setInterval(() => {
        this.allowedRequests = 50
        remaining -= 1000

        this.requestsExecutedPeriod = this.requestsExecutedNow
        this.requestsExecutedNow = 0

        if (remaining <= 0) {
          remaining = 10 * 60 * 1000 // 10 minutes, in ms
          this.allowedInvalidRequests = 10_000
        }
      }, 1000)

    } else {
      this.resetInterval = setInterval(async () => {

        this.requestsExecutedPeriod = this.requestsExecutedNow
        this.requestsExecutedNow = 0



      }, 1000)
    }
  }

}
