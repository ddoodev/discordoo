import { RestOptions } from '@src/rest'
import { ProviderOption } from '@src/core'

export interface WebhookClientOptions {
  /** Webhook ID */
  id: string
  /** Webhook token */
  token: string
  /** Webhook REST options */
  rest?: RestOptions
  /** Allowed mentions options */
  allowedMentions?: any // TODO: AllowedMentionsResolvable
  /** Providers */
  providers?: ProviderOption[]
}