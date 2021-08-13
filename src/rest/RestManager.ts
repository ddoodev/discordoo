import { RestProvider } from '@src/core/providers/rest/RestProvider'
import { Client, ProviderConstructor } from '@src/core'
import { RestRequestResponse } from '@src/core/providers/rest/RestRequestResponse'
import { RestRequest } from '@src/core/providers/rest/requests/RestRequest'
import { makeRequest } from '@src/rest/makeRequest'
import { RestManagerOptions } from '@src/rest/RestManagerOptions'
import { RestManagerRequestData } from '@src/rest/interfaces/RestManagerRequestData'
import { RestLimitsManager } from '@src/rest/RestLimitsManager'
import { RestRequestOptions } from '@src/core/providers/rest/requests/RestRequestOptions'

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

  async request<T = any>(data: RestManagerRequestData, options: RestRequestOptions = {}): Promise<RestRequestResponse<T>> {

    if (!this.client.options.rest?.rateLimits?.disable) {
      // do rate limits
    }

    const response = await this.provider.request<T>({
      method: data.method,
      path: data.path,
      attachments: data.attachments ?? [],
      headers: data.headers,
      body: data.body,
    }, options)

    // this.limiter.passHeaders or something

    return response
  }

  async init(): Promise<void> {
    await this.limiter.init()
    await this.provider.init()
  }

}
