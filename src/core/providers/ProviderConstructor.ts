import { AnyDiscordApplication } from '@src/core/apps/AnyDiscordApplication'

export interface ProviderConstructor<Provider> {
  new (app: AnyDiscordApplication, options: any, providerOptions?: any): Provider
}

export interface RestProviderConstructor<Provider> {
  new (app: AnyDiscordApplication, options: any, providerOptions?: any): Provider
}
