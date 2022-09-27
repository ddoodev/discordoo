import { CompletedRestOptions, DefaultRestProvider } from '@src/rest'
import { WebhookClientOptions } from '@src/core/client/webhook/WebhookClientOptions'
import { WebhookRestManager } from '@src/rest/WebhookRestManager'
import { DiscordooProviders, REST_DEFAULT_OPTIONS } from '@src/constants'
import { WebhookClientInternals } from '@src/core/client/webhook/WebhookClientInternals'
import { DefaultWebhookClientStack } from '@src/core/client/webhook/DefaultWebhookClientStack'
import { ProviderConstructor, RestProviderConstructor } from '@src/core/providers/ProviderConstructor'
import { DiscordooError } from '@src/utils'
import { WebhookClientActions } from '@src/core/client/webhook/WebhookClientActions'
import { WebhookClientMessagesManager } from '@src/api/managers/messages/WebhookClientMessagesManager'

export class WebhookClient<ClientStack extends DefaultWebhookClientStack = DefaultWebhookClientStack> {
  public readonly id: string
  public readonly token: string
  public readonly internals: WebhookClientInternals
  public readonly options: WebhookClientOptions

  public readonly messages = new WebhookClientMessagesManager(this)

  constructor(options: WebhookClientOptions) {
    this.id = options.id
    this.token = options.token

    this.options = options

    let restProvider: ProviderConstructor<ClientStack['rest']> = DefaultRestProvider
    let restProviderOptions

    this.options.providers?.forEach(provider => {
      try {
        switch (provider.provide) {
          case DiscordooProviders.REST:
            restProvider = provider.useClass
            restProviderOptions = provider.useOptions
            break
        }
      } catch (e) {
        throw new DiscordooError('WebhookClient#constructor', 'one of providers threw error when initialized:', e)
      }
    })

    const restOptions = this._makeRestOptions(options)

    const rest = new WebhookRestManager<ClientStack['rest']>(
      this,
      restProvider as RestProviderConstructor<any>,
      { restOptions, providerOptions: restProviderOptions }
    )

    this.internals = {
      rest,
      actions: new WebhookClientActions(this)
    }
  }

  private _makeRestOptions(options: WebhookClientOptions): CompletedRestOptions {
    return {
      requestTimeout: options.rest?.requestTimeout ?? REST_DEFAULT_OPTIONS.requestTimeout,
      userAgent: options.rest?.userAgent ?? REST_DEFAULT_OPTIONS.userAgent,
      retries: options.rest?.retries ?? REST_DEFAULT_OPTIONS.retries,
      api: Object.assign({}, REST_DEFAULT_OPTIONS.api, options.rest?.api),
      cdn: Object.assign({}, REST_DEFAULT_OPTIONS.cdn, options.rest?.cdn),
      limits: Object.assign({}, REST_DEFAULT_OPTIONS.limits, options.rest?.limits)
    }
  }
}