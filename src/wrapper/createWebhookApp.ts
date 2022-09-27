import { CreateAppOptions } from '@src/wrapper/interfaces'
import { CreateWebhookData } from '@src/wrapper/interfaces/CreateWebhookData'
import { WebhookClientBuilder } from '@src/wrapper/WebhookClientBuilder'
import { DefaultWebhookClientStack } from '@src/core/client/webhook/DefaultWebhookClientStack'

export function createWebhookApp<Stack extends DefaultWebhookClientStack = DefaultWebhookClientStack>(
  data: CreateWebhookData, options?: CreateAppOptions
) {
  return new WebhookClientBuilder<Stack>(data, options)
}