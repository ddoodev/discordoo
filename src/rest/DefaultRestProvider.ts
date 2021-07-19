import { RestProvider } from '@src/core/providers/rest/RestProvider'
import { RestProviderRequestOptions } from '@src/core/providers/rest/options/RestProviderRequestOptions'
import { RestRequestResponse } from '@src/core/providers/rest/RestRequestResponse'
import { Client } from '@src/core'

export class DefaultRestProvider implements RestProvider {
  public client: Client

  constructor(client: Client) {
    this.client = client
  }

  async init(): Promise<unknown> {
    return void 0
  }

  request<T = any>(options: RestProviderRequestOptions): RestRequestResponse<T> {
    return Promise.resolve({ success: true, result: 'yes.' as unknown as T })
  }

}
