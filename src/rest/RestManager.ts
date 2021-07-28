import { RestProvider } from '@src/core/providers/rest/RestProvider'
import { Client, ProviderConstructor } from '@src/core'
import { RestRequestResponse } from '@src/core/providers/rest/RestRequestResponse'
import { RestRequest } from '@src/core/providers/rest/requests/RestRequest'
import { makeRequest } from '@src/rest/makeRequest'
import { RestManagerOptions } from '@src/rest/RestManagerOptions'
import { RestManagerRequestOptions } from '@src/rest/interfaces/RestManagerRequestOptions'

export class RestManager<P extends RestProvider = RestProvider> {
  public client: Client
  public provider: P

  constructor(client: Client, provider: ProviderConstructor<P>, options: RestManagerOptions) {
    this.client = client
    this.provider = new provider(this.client, options.provider)
  }

  get api(): RestRequest {
    return makeRequest(this)
  }

  request<T = any>(options: RestManagerRequestOptions): RestRequestResponse<T> {
    return this.provider.request<T>(options)
  }

  init(): Promise<unknown> {
    return this.provider.init()
  }

}
