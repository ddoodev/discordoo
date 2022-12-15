import { DiscordApplication, ApplicationOptions, DefaultApplicationStack, ProviderConstructor } from '@src/core'
import { DiscordooProviders } from '@src/constants'
import { CreateAppOptions } from '@src/wrapper/interfaces/CreateAppOptions'
import { is } from 'typescript-is'
import { ValidationError } from '@src/utils/ValidationError'
import { GatewayOptions } from '@src/gateway'
import { ReplaceType } from '@src/utils'

export class ApplicationBuilder<Stack extends DefaultApplicationStack = DefaultApplicationStack> {
  public token: string
  public options: ApplicationOptions

  private readonly customClient: any

  constructor(token: string, options?: CreateAppOptions) {
    if (!is<string>(token)) throw new ValidationError('ApplicationBuilder', 'Invalid token provided:', token)

    this.token = token

    this.options = {}
    if (!this.options.providers) this.options.providers = []

    if (options?.useApp) this.customClient = options.useApp
  }

  rest(options: ApplicationOptions['rest']): ApplicationBuilder<Stack> {
    if (!is<ApplicationOptions['rest']>(options)) this.throwInvalidOptionsError('rest', options)

    this.options.rest = options
    return this
  }

  gateway(options: ApplicationOptions['gateway']): ApplicationBuilder<Stack> {
    if (!is<ReplaceType<GatewayOptions, 'intents', number | number[]> | undefined>(options)) {
      this.throwInvalidOptionsError('gateway', options)
    }

    this.options.gateway = options
    return this
  }

  cache(options: ApplicationOptions['cache']): ApplicationBuilder<Stack> {
    if (!is<ApplicationOptions['cache']>(options)) this.throwInvalidOptionsError('cache', options)

    this.options.cache = options
    return this
  }

  ipc(options: ApplicationOptions['ipc']): ApplicationBuilder<Stack> {
    if (!is<ApplicationOptions['ipc']>(options)) this.throwInvalidOptionsError('ipc', options)

    this.options.ipc = options
    return this
  }

  extenders(extenders: ApplicationOptions['extenders']): ApplicationBuilder<Stack> {
    this.options.extenders = extenders
    return this
  }

  custom<T>(options: ApplicationOptions<T>['custom']): ApplicationBuilder<Stack> {
    this.options.custom = options
    return this
  }

  restProvider(provider: ProviderConstructor<Stack['rest']>, ...options: any[]): ApplicationBuilder<Stack> {
    return this.useProvider(DiscordooProviders.Rest, provider, ...options)
  }

  cacheProvider(provider: ProviderConstructor<Stack['cache']>, ...options: any[]): ApplicationBuilder<Stack> {
    return this.useProvider(DiscordooProviders.Cache, provider, ...options)
  }

  gatewayProvider(provider: ProviderConstructor<Stack['gateway']>, ...options: any[]): ApplicationBuilder<Stack> {
    return this.useProvider(DiscordooProviders.Gateway, provider, ...options)
  }

  private useProvider(providerSignature: DiscordooProviders, provider: any, ...options: any[]): ApplicationBuilder<Stack> {
    const providerIndex = this.options.providers!.findIndex(p => p.provide === provider)
    if (providerIndex > -1) this.options.providers!.splice(providerIndex, 1)

    this.options.providers!.push({
      provide: providerSignature,
      useClass: provider,
      useOptions: options
    })

    return this
  }

  private throwInvalidOptionsError(from: string, invalid: any) {
    throw new ValidationError(
      `${this.constructor.name}#${from} | createApp#${from}`,
      'invalid', from, 'options provided'
    )._setInvalidOptions(invalid)
  }

  build<T extends DiscordApplication = DiscordApplication<Stack>>(): T {
    if (this.customClient) return new this.customClient(this.token, this.options)

    return new DiscordApplication<Stack>(this.token, this.options) as unknown as T
  }
}
