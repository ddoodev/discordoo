import { Client, ClientOptions, DefaultClientStack, ProviderConstructor } from '@src/core'
import { DiscordooProviders } from '@src/core/Constants'
import { CreateAppOptions } from '@src/wrapper/interfaces/CreateAppOptions'

export class ClientBuilder<Stack extends DefaultClientStack = DefaultClientStack> {
  public token: string
  public options: ClientOptions

  private readonly customClient: any

  constructor(token: string, options?: CreateAppOptions) {
    this.token = token

    this.options = {}
    if (!this.options.providers) this.options.providers = []

    if (options?.useClient) this.customClient = options.useClient
  }

  rest(options: ClientOptions['rest']): ClientBuilder<Stack> {
    this.options.rest = options
    return this
  }

  gateway(options: ClientOptions['gateway']): ClientBuilder<Stack> {
    this.options.gateway = options
    return this
  }

  ipc(options: ClientOptions['ipc']): ClientBuilder<Stack> {
    this.options.ipc = options
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

  build<T extends Client = Client<Stack>>(): T {
    if (this.customClient) return new this.customClient(this.token, this.options)

    return new Client<Stack>(this.token, this.options) as unknown as T
  }
}
