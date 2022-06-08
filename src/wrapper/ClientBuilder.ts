import { Client, ClientOptions, DefaultClientStack, ProviderConstructor } from '@src/core'
import { DiscordooProviders } from '@src/constants'
import { CreateAppOptions } from '@src/wrapper/interfaces/CreateAppOptions'
import { is } from 'typescript-is'
import { ValidationError } from '@src/utils/ValidationError'
import { GatewayOptions } from '@src/gateway'
import { ReplaceType } from '@src/utils'

export class ClientBuilder<Stack extends DefaultClientStack = DefaultClientStack> {
  public token: string
  public options: ClientOptions

  private readonly customClient: any

  constructor(token: string, options?: CreateAppOptions) {
    if (!is<string>(token)) throw new ValidationError('ClientBuilder', 'Invalid token provided:', token)

    this.token = token

    this.options = {}
    if (!this.options.providers) this.options.providers = []

    if (options?.useClient) this.customClient = options.useClient
  }

  rest(options: ClientOptions['rest']): ClientBuilder<Stack> {
    if (!is<ClientOptions['rest']>(options)) this.throwInvalidOptionsError('rest', options)

    this.options.rest = options
    return this
  }

  gateway(options: ClientOptions['gateway']): ClientBuilder<Stack> {
    if (!is<ReplaceType<GatewayOptions, 'intents', number | number[]> | undefined>(options)) {
      this.throwInvalidOptionsError('gateway', options)
    }

    this.options.gateway = options
    return this
  }

  cache(options: ClientOptions['cache']): ClientBuilder<Stack> {
    if (!is<ClientOptions['cache']>(options)) this.throwInvalidOptionsError('cache', options)

    this.options.cache = options
    return this
  }

  ipc(options: ClientOptions['ipc']): ClientBuilder<Stack> {
    if (!is<ClientOptions['ipc']>(options)) this.throwInvalidOptionsError('ipc', options)

    this.options.ipc = options
    return this
  }

  extenders(extenders: ClientOptions['extenders']): ClientBuilder<Stack> {
    this.options.extenders = extenders
    return this
  }

  custom<T>(options: ClientOptions<T>['custom']): ClientBuilder<Stack> {
    this.options.custom = options
    return this
  }

  restProvider(provider: ProviderConstructor<Stack['rest']>, ...options: any[]): ClientBuilder<Stack> {
    return this.useProvider(DiscordooProviders.REST, provider, ...options)
  }

  cacheProvider(provider: ProviderConstructor<Stack['cache']>, ...options: any[]): ClientBuilder<Stack> {
    return this.useProvider(DiscordooProviders.CACHE, provider, ...options)
  }

  gatewayProvider(provider: ProviderConstructor<Stack['gateway']>, ...options: any[]): ClientBuilder<Stack> {
    return this.useProvider(DiscordooProviders.GATEWAY, provider, ...options)
  }

  private useProvider(providerSignature: DiscordooProviders, provider: any, ...options: any[]): ClientBuilder<Stack> {
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

  build<T extends Client = Client<Stack>>(): T {
    if (this.customClient) return new this.customClient(this.token, this.options)

    return new Client<Stack>(this.token, this.options) as unknown as T
  }
}
