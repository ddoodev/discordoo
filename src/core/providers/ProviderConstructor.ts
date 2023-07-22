import { AnyDiscordApplication } from '../../../src/core/apps/AnyDiscordApplication'

export interface ProviderConstructor<Provider, App = AnyDiscordApplication> {
  new (app: App, options: any, providerOptions?: any): Provider
}
