import { WebhookApplicationActions } from '@src/core'
import { WebhookRestManager } from '@src/rest/WebhookRestManager'

export interface WebhookApplicationInternals {
  /** RestManager used by this app */
  rest: WebhookRestManager
  /** DiscordApplication Actions */
  actions: WebhookApplicationActions
}