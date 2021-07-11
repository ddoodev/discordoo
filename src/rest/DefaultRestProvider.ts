import { RestProvider } from '@src/core/providers/rest/RestProvider'
import { RestRequest } from '@src/core/providers/rest/requests/RestRequest'
import { makeRequest } from '@src/rest/makeRequest'
import { RestProviderRequestOptions } from '@src/core/providers/rest/options/RestProviderRequestOptions'
import { RestRequestResponse } from '@src/core/providers/rest/RestRequestResponse'
import { Client } from '@src/core'

export class DefaultRestProvider implements RestProvider {
  public client: Client

  constructor(client: Client) {
    this.client = client
  }

  get api(): RestRequest {
    return makeRequest(this)
  }

  request<T = any>(options: RestProviderRequestOptions): RestRequestResponse<T> {
    return Promise.resolve({ success: true, result: 'yes.' as unknown as T })
  }

}
