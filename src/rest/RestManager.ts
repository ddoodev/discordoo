import {
  Client,
  ProviderConstructor
} from '@src/core'
import {
  RestRequest,
  RestManagerOptions,
  RestManagerRequestData,
  RestLimitsManager,
  makeRequest
} from '@src/rest'
import {
  RestProvider,
  RestRequestOptions,
  RestFinishedResponse
} from '@discordoo/providers'

export class RestManager<P extends RestProvider = RestProvider> {
  public client: Client
  public provider: P
  public limiter: RestLimitsManager

  constructor(client: Client, provider: ProviderConstructor<P>, options: RestManagerOptions) {
    this.client = client
    this.provider = new provider(this.client, options.provider)
    // console.log('PROVIDER OPTIONS', options.provider)
    this.limiter = new RestLimitsManager(this.client)
  }

  api(): RestRequest {
    return makeRequest(this)
  }

  async request<T = any>(data: RestManagerRequestData, options: RestRequestOptions = {}): RestFinishedResponse<T> {

    if (!this.client.options.rest?.rateLimits?.disable) {
      // TODO: rate limits
    }

    const response = await this.provider.request<T>({
      method: data.method,
      path: data.path,
      attachments: data.attachments ?? [],
      headers: data.headers,
      body: data.body,
    }, options)

    // TODO: this.limiter.passHeaders or something

    return response
  }

  async init(): Promise<void> {
    await this.limiter.init()
    await this.provider.init()
  }

}
