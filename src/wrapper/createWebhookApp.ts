import { CreateAppOptions } from '@src/wrapper/interfaces'
import { CreateWebhookData } from '@src/wrapper/interfaces/CreateWebhookData'
import { WebhookApplicationBuilder } from '@src/wrapper/WebhookApplicationBuilder'
import { DefaultWebhookClientStack } from '@src/core/apps/webhook/DefaultWebhookClientStack'

export function createWebhookApp<Stack extends DefaultWebhookClientStack = DefaultWebhookClientStack>(
  data: CreateWebhookData, options?: CreateAppOptions
) {
  return new WebhookApplicationBuilder<Stack>(data, options)
}