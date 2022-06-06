import { Client } from '@src/core'
import { Collection } from '@discordoo/collection'
import { RestManagerRequestData } from '@src/rest/interfaces'
import { RestRateLimitBucket } from '@src/rest/interfaces/RestRateLimitBucket'
import { RestFinishedResponse, RestRequestOptions } from '@discordoo/providers'
import { wait } from '@src/utils'

/**
 * Used to comply with the Discord rate limits.
 *
 * How it works:
 *
 * */
export class RestLimitsManager {
  public client: Client

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

  constructor(client: Client) {
    this.client = client
  }

  public execute(request: RestManagerRequestData, options?: RestRequestOptions) {
    const bucket = this.bucket(request)

    if (!bucket) {
      return new Promise((resolve, reject) => {
        const id = `${request.method}://${request.path}`

        const queue = this.queues.get(id)

        if (queue) {
          queue.push({ res: resolve, rej: reject, req: request, opt: options })
          this.queues.set(id, queue)
        } else {
          this.queues.set(id, [
            { res: resolve, rej: reject, req: request, opt: options }
          ])
        }

        this.processUnlimitedBucket(id, !!queue)
      })
    }
  }

  private async processUnlimitedBucket(queueId: string, isFirstRequest: boolean) {
    const queue = this.queues.get(queueId)
    if (!queue) return

    const first = queue.shift()
    if (!first) return

    if (isFirstRequest) {
      const request = first.req, options = first.opt

      const result = await this.perform(request, options)
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
      }

    }
  }

  private async perform(
    request: RestManagerRequestData, options?: RestRequestOptions, retried = 0
  ): RestFinishedResponse<any> {
    const result = await this.client.internals.rest.provider.request({
      method: request.method,
      path: request.path,
      attachments: request.attachments ?? [],
      headers: request.headers,
      body: request.body,
    }, options)

    if (result.statusCode < 500 && result.statusCode !== -1) {
      return result
    } else {
      if (retried >= this.client.internals.options.rest.retries) return result
      return wait(1000).then(() => this.perform(request, options, retried++))
    }
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
       * This interval will reset allowed requests/s every second,
       * and also it will reset allowed invalid requests/10m every 10 minutes
       * */
      this.resetInterval = setInterval(() => {
        this.allowedRequests = 50
        this.allowedResetAt = Date.now() + 1000
        remaining -= 1000

        this.requestsExecutedPeriod = this.requestsExecutedNow
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
        this.requestsExecutedNow = 0
      }, 1000)
    }
  }

}
