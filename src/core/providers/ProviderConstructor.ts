import { Client } from '@src/core'
import { WebhookClient } from '@src/core/client/webhook/WebhookClient'

export interface ProviderConstructor<Provider> {
  new (client: Client, options: any, providerOptions?: any): Provider
}

export interface RestProviderConstructor<Provider> {
  new (client: Client | WebhookClient, options: any, providerOptions?: any): Provider
}
