import { WebhookApplication } from '@src/core/apps/webhook/WebhookApplication'
import { CompletedRestOptions, RestManagerData, RestManagerRequestData } from '@src/rest/interfaces'
import { RestFinishedResponse, RestProvider, RestRequestOptions } from '@discordoo/providers'
import { WebhookRestRequest } from '@src/rest/interfaces/RestRequest'
import { makeWebhookRequest } from '@src/rest/makeRequest'
import { ProviderConstructor } from '@src/core'

export class WebhookRestManager<P extends RestProvider = RestProvider> {
  public app: WebhookApplication
  public provider: P
  public options: CompletedRestOptions

  constructor(app: WebhookApplication, Provider: ProviderConstructor<P, WebhookApplication>, data: RestManagerData) {
    this.app = app
    this.options = data.restOptions
    this.provider = new Provider(this.app, data.restOptions, data.providerOptions)
  }

  api(): WebhookRestRequest {
    return makeWebhookRequest(this)
  }

  async request<T = any>(data: RestManagerRequestData, options: RestRequestOptions = {}): RestFinishedResponse<T> {
    return this.provider.request<T>({
      method: data.method,
      path: data.path,
      attachments: data.attachments ?? [],
      headers: data.headers,
      body: data.body,
    }, { ...options, useAuth: false })
  }

  async init(): Promise<void> {
    await this.provider.init()
  }

}