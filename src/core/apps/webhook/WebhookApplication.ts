import {
  DefaultWebhookApplicationStack,
  ProviderConstructor,
  WebhookApplicationActions,
  WebhookApplicationInternals,
  WebhookApplicationOptions
} from '@src/core'
import { DiscordooError } from '@src/utils'
import { DiscordooProviders, REST_DEFAULT_OPTIONS } from '@src/constants'
import { CompletedRestOptions, DefaultRestProvider } from '@src/rest'
import { WebhookClientMessagesManager } from '@src/api'
import { WebhookRestManager } from '@src/rest/WebhookRestManager'

export class WebhookApplication<ClientStack extends DefaultWebhookApplicationStack = DefaultWebhookApplicationStack> {
  public readonly id: string
  readonly #token: string
  public readonly internals: WebhookApplicationInternals
  public readonly options: WebhookApplicationOptions

  public readonly messages: WebhookClientMessagesManager = new WebhookClientMessagesManager(this)

  constructor(options: WebhookApplicationOptions) {
    this.id = options.id
    this.#token = options.token

    this.options = options

    let restProvider: ProviderConstructor<ClientStack['rest']> = DefaultRestProvider
    let restProviderOptions

    this.options.providers?.forEach(provider => {
      try {
        switch (provider.provide) {
          case DiscordooProviders.Rest:
            restProvider = provider.useClass
            restProviderOptions = provider.useOptions
            break
        }
      } catch (e) {
        throw new DiscordooError('WebhookApplication#constructor', 'one of providers threw error when initialized:', e)
      }
    })

    const restOptions = this._makeRestOptions(options)

    const rest = new WebhookRestManager<ClientStack['rest']>(
      this,
      restProvider as unknown as ProviderConstructor<any, WebhookApplication>,
      { restOptions, providerOptions: restProviderOptions }
    )

    this.internals = {
      rest,
      actions: new WebhookApplicationActions(this)
    }
  }

  get token(): string {
    return this.#token
  }

  private _makeRestOptions(options: WebhookApplicationOptions): CompletedRestOptions {
    return {
      requestTimeout: options.rest?.requestTimeout ?? REST_DEFAULT_OPTIONS.requestTimeout,
      userAgent: options.rest?.userAgent ?? REST_DEFAULT_OPTIONS.userAgent,
      retries: options.rest?.retries ?? REST_DEFAULT_OPTIONS.retries,
      retryWait: options.rest?.retryWait ?? REST_DEFAULT_OPTIONS.retryWait,
      api: Object.assign({}, REST_DEFAULT_OPTIONS.api, options.rest?.api),
      cdn: Object.assign({}, REST_DEFAULT_OPTIONS.cdn, options.rest?.cdn),
      limits: Object.assign({}, REST_DEFAULT_OPTIONS.limits, options.rest?.limits),
      invites: Object.assign({}, REST_DEFAULT_OPTIONS.invites, options.rest?.invites),
      gifts: Object.assign({}, REST_DEFAULT_OPTIONS.gifts, options.rest?.gifts)
    }
  }
}
