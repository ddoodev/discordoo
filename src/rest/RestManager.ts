import { ProviderConstructor } from '@src/core'
import { RestRequest, RestManagerData, RestManagerRequestData, RestLimitsManager, makeRequest } from '@src/rest'
import { RestProvider, RestRequestOptions, RestFinishedResponse } from '@discordoo/providers'
import { CompletedRestOptions } from '@src/rest'
import { DiscordCdnLinker } from '@src/rest/DiscordCdnLinker'
import { RestEligibleDiscordApplication } from '@src/core/apps/AnyDiscordApplication'

export class RestManager<P extends RestProvider = RestProvider> {
  public app: RestEligibleDiscordApplication
  public provider: P
  public limiter: RestLimitsManager
  public options: CompletedRestOptions
  public cdn: DiscordCdnLinker

  constructor(app: RestEligibleDiscordApplication, Provider: ProviderConstructor<P>, data: RestManagerData) {
    this.app = app
    this.provider = new Provider(this.app, data.restOptions, data.providerOptions)
    this.limiter = new RestLimitsManager(this.app)
    this.options = data.restOptions

    this.cdn = new DiscordCdnLinker(
      'https://' + this.options.cdn.domain,
      this.options.cdn.defaultImgFormat,
      this.options.cdn.defaultImgSize
    )
  }

  api(): RestRequest {
    return makeRequest(this)
  }

  async request<T = any>(data: RestManagerRequestData, options: RestRequestOptions = {}): RestFinishedResponse<T> {

    // if (!this.app.options.rest?.rateLimits?.disable) {
      // TODO: rate limits
    // }

    const response = await this.provider.request<T>({
      method: data.method,
      path: data.path,
      attachments: data.attachments,
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
