import { RestOptions } from '../../../../src/rest'
import { ProviderOption } from '../../../../src/core'
import { AllowedMentionsResolvable } from '../../../../src/api'

export interface WebhookApplicationOptions {
  /** Webhook ID */
  id: string
  /** Webhook token */
  token: string
  /** Webhook Rest options */
  rest?: RestOptions
  /** Allowed mentions options */
  allowedMentions?: AllowedMentionsResolvable
  /** Providers */
  providers?: ProviderOption[]
}
