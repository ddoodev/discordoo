import { WebhookRestManager } from '@src/rest/WebhookRestManager'
import { WebhookClientActions } from '@src/core/client/webhook/WebhookClientActions'

export interface WebhookClientInternals {
  /** RestManager used by this client */
  rest: WebhookRestManager
  /** Client Actions */
  actions: WebhookClientActions
}