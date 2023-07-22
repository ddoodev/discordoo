import { Collection } from '@discordoo/collection'
import { RestManagerRequestData } from '@src/rest/interfaces'
import { RestRateLimitBucket } from '@src/rest/interfaces/RestRateLimitBucket'
import { RestFinishedResponse, RestRequestOptions } from '@discordoo/providers'
import { wait } from '@src/utils'
import { RestEligibleDiscordApplication } from '@src/core/apps/AnyDiscordApplication'

/**
 * Used to comply with the Discord rate limits.
 *
 * How it works:
 *
 * */
export class RestLimitsManager {
  public app: RestEligibleDiscordApplication

  private allowedRequests = 50
  private allowedResetAt = Date.now() + 1000
  private allowedInvalidRequests = 10_000
  private invalidResetAt = Date.now() + 10 * 60 * 1000
  private resetInterval?: ReturnType<typeof setInterval>
  private lockPromise?: Promise<void>

  private RESET_AFTER_HEADER = 'X-RateLimit-Reset-After'
  private RESET_HEADER = 'X-RateLimit-Reset'
  private LIMIT_HEADER = 'X-RateLimit-Limit'
  private REMAINING_HEADER = 'X-RateLimit-Remaining'
  private GLOBAL_HEADER = 'X-RateLimit-Global'
  private HASH_HEADER = 'X-RateLimit-Bucket'
  private RETRY_AFTER_HEADER = 'Retry-After'

  private hashes = new Collection<string, string>()
  private buckets = new Collection<string, RestRateLimitBucket>()
  private queues = new Collection<string, Array<{ res: any; rej: any; req: RestManagerRequestData; opt?: RestRequestOptions }>>()

  /** Requests executed for the current second */
  public requestsExecutedNow = 0
  /** Requests executed for the previous second */
  public requestsExecutedPeriod = 0
  /** Requests executed total */
  public requestsExecuted = 0

  public locked = false

  constructor(app: RestEligibleDiscordApplication) {
    this.app = app
  }

  public execute(request: RestManagerRequestData, options?: RestRequestOptions) {
    return new Promise((resolve, reject) => {
      const bucket = this.getBucket(request)

      const id = `${request.method}://${request.path}`

      if (!bucket) {
        const queue = this.queues.get(id)

        if (queue) {
          queue.push({ res: resolve, rej: reject, req: request, opt: options })
          this.queues.set(id, queue)
        } else {
          this.queues.set(id, [
            { res: resolve, rej: reject, req: request, opt: options }
          ])
        }

        this.processUnlimitedBucket(id, !!queue) // promise resolves when request is processed in queue handler
      } else {
        this.processLimitedBucket(id)
      }
    })
  }

  public lock(until: number) {
    const now = Date.now()

    if (until > now) {
      this.locked = true
      this.lockPromise = new Promise(res => {
        setTimeout(() => {
          this.locked = false
          res()
        }, until - now)
      })
    }
  }

  private async processUnlimitedBucket(queueId: string, isFirstRequest: boolean) {
    if (this.locked) {
      await this.lockPromise
    }

    const queue = this.queues.get(queueId)
    if (!queue) return

    const first = queue.shift()
    if (!first) return

    if (isFirstRequest) {
      const request = first.req, options = first.opt

      const result = await this.performRequest(request, options)
      if (result.statusCode >= 500) {
        first.res(result)
        return this.processUnlimitedBucket(queueId, true)
      } else {
        const headers = result.headers
        const hash = result.headers[this.HASH_HEADER]

        this.hashes.set(queueId, hash)
        this.buckets.set(hash, {
          hash,
          resetAfter: headers[this.RESET_AFTER_HEADER] * 1000,
          remaining: headers[this.REMAINING_HEADER],
          resetTime: headers[this.RESET_HEADER] * 1000,
          limit: headers[this.LIMIT_HEADER],
          queue: []
        })

        first.res(result)
        return this.processLimitedBucket(queueId)
      }
    } // else wait for first request to finish
  }

  private async processLimitedBucket(queueId: string) {
    // check if queue exists
    const queue = this.queues.get(queueId)
    if (!queue) return

    // get first request
    const first = queue.shift()
    if (!first) return

    // form a request
    const request = first.req, options = first.opt

    // get endpoint bucket
    const bucket = this.getBucket(request)
    if (!bucket) return

    const now = Date.now()

    // check if bucket is limited
    if (bucket.remaining <= 0) {
      // check if bucket is limited by its rate limit
      if (bucket.resetTime > now) {
        // if limited, add first request back to queue
        queue.unshift(first)
        // update queue to have new first request
        this.queues.set(queueId, queue)
        // and wait until reset time
        await wait(bucket.resetTime - now)
        // and then process request again
        return this.processLimitedBucket(queueId)
      } else {
        // if not limited, reset bucket limit
        bucket.remaining = bucket.limit
        // and update bucket
        this.buckets.set(bucket.hash, bucket)
      }
    }

    // bucket is not limited, execute request
    const result = await this.performRequest(request, options)

    // check if request was successful
    if (result.statusCode >= 500) {
      // discord's fault, return result as is
      first.res(result)
      // and process next request
      return this.processLimitedBucket(queueId)
    } else {
      // if successful or not discord's fault
      // form headers
      const headers = result.headers
      // get bucket hash
      const hash = headers[this.HASH_HEADER]

      // update hashes
      this.hashes.set(queueId, hash)
      // set new bucket limit data
      this.buckets.set(hash, {
        hash,
        resetAfter: headers[this.RESET_AFTER_HEADER] * 1000,
        remaining: headers[this.REMAINING_HEADER],
        resetTime: headers[this.RESET_HEADER] * 1000,
        limit: headers[this.LIMIT_HEADER],
        queue: bucket.queue // keep queue
      })

      // return result
      first.res(result)
      // and process next request
      return this.processLimitedBucket(queueId)
    }
  }

  private async performRequest(
    request: RestManagerRequestData, options?: RestRequestOptions, retries = 0
  ): RestFinishedResponse<any> {
    // perform request via rest provider
    const result = await this.app.internals.rest.provider.request({
      method: request.method,
      path: request.path,
      attachments: request.attachments ?? [],
      headers: request.headers,
      body: request.body,
    }, options)
    this.requestsExecutedNow++

    if (result.statusCode < 500 && result.statusCode !== -1) {
      return result
    } else {
      if (retries >= this.app.internals.options.rest.retries) return result
      await wait(this.app.internals.options.rest.retryWait)
      return this.performRequest(request, options, retries++)
    }
  }

  private getBucket(request: RestManagerRequestData): RestRateLimitBucket | undefined {
    const hash = this.hashes.get(`${request.method}://${request.path}`)

    if (hash) {
      if (hash === 'unlimited') return undefined

      return this.buckets.get(`${request.majorParameter ?? 'unknown'}+${hash}`)
    }
  }

  async init() {
    if (!this.app.internals.sharding.active) {
      let remaining = 10 * 60 * 1000 // 10 minutes, in ms

      /**
       * This interval will reset allowed requests/s every second,
       * and also it will reset allowed invalid requests/10m every 10 minutes
       * */
      this.resetInterval = setInterval(() => {
        this.allowedRequests = 50
        this.allowedResetAt = Date.now() + 1000
        remaining -= 1000

        this.requestsExecutedPeriod = this.requestsExecutedNow
        this.requestsExecuted += this.requestsExecutedPeriod
        this.requestsExecutedNow = 0

        if (remaining <= 0) {
          remaining = 10 * 60 * 1000 // 10 minutes, in ms
          this.allowedInvalidRequests = 10_000
          this.invalidResetAt = Date.now() + remaining
        }
      }, 1000)

    } else {
      this.resetInterval = setInterval(() => {
        this.requestsExecutedPeriod = this.requestsExecutedNow
        this.requestsExecuted += this.requestsExecutedPeriod
        this.requestsExecutedNow = 0
      }, 1000)
    }
  }
}
