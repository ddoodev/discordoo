import { WebhookRestManager } from '@src/rest/WebhookRestManager'
import { WebhookClientActions } from '@src/core/apps/webhook/WebhookClientActions'

export interface WebhookClientInternals {
  /** RestManager used by this app */
  rest: WebhookRestManager
  /** DiscordApplication Actions */
  actions: WebhookClientActions
}