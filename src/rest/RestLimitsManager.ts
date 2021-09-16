import { Client } from '@src/core'

export class RestLimitsManager {
  public client: Client

  private allowedRequests = 50
  private allowedInvalidRequests = 10_000
  private allowedRequestsResetInterval?: ReturnType<typeof setInterval>
  private allowedInvalidRequestsResetInterval?: ReturnType<typeof setInterval>

  public limited = false

  constructor(client: Client) {
    this.client = client
  }

  async init() {
    if (!this.client.internals.sharding.active) {
      this.allowedRequestsResetInterval = setInterval(() => {
        this.allowedRequests = 50
      }, 1000)

      this.allowedInvalidRequestsResetInterval = setInterval(() => {
        this.allowedInvalidRequests = 10_000
      }, 10 * 60 * 1000) // 10 minutes
    }
  }

}
