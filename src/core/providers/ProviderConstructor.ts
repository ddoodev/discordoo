import { Client } from '@src/core'

export interface ProviderConstructor<Provider> {
  new (client: Client, options: any, providerOptions?: any): Provider
}
