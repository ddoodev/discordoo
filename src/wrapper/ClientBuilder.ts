import { Client, DefaultClientStack, ClientOptions, ProviderConstructor } from '@src/core'
import { DiscordooProviders } from '@src/core/Constants'

export class ClientBuilder<Stack extends DefaultClientStack = DefaultClientStack> {
  public token: string
  public options: ClientOptions

  constructor(token: string, options?: ClientOptions) {
    this.token = token

    this.options = options || {}
    if (!this.options.providers) this.options.providers = []
  }

  restProvider(provider: ProviderConstructor<Stack['cache']>): ClientBuilder<Stack> {
    this.removeProvider(DiscordooProviders.REST)

    this.options.providers!.push({
      provide: DiscordooProviders.REST,
      // @ts-ignore
      use: provider
    })

    return this
  }

  cacheProvider(provider: ProviderConstructor<Stack['cache']>, ...options: any[]): ClientBuilder<Stack> {
    this.removeProvider(DiscordooProviders.CACHE)

    this.options.providers!.push({
      provide: DiscordooProviders.CACHE,
      useClass: provider,
      useOptions: options
    })

    return this
  }

  gatewayProvider(provider: ProviderConstructor<Stack['gateway']>, ...options: any[]): ClientBuilder<Stack> {
    this.removeProvider(DiscordooProviders.GATEWAY)

    this.options.providers!.push({
      provide: DiscordooProviders.GATEWAY,
      useClass: provider,
      useOptions: options
    })

    return this
  }

  private removeProvider(provider: DiscordooProviders) {
    const providerIndex = this.options.providers!.findIndex(p => p.provide === provider)
    if (providerIndex > -1) this.options.providers!.splice(providerIndex, 1)
  }

  build(): Client {
    return new Client(this.token, this.options)
  }
}
