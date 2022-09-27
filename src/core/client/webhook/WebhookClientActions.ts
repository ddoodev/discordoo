import { WebhookClient } from '@src/core/client/webhook/WebhookClient'
import { RawExecuteWebhookQuery } from '@src/core/client/webhook/RawExecuteWebhookQuery'
import { Endpoints } from '@src/constants'
import { WebhookMessageCreateData } from '@src/api/entities/message/interfaces/MessageCreateData'
import { RestFinishedResponse } from '@discordoo/providers'
import { RawMessageData } from '@src/api'

export class WebhookClientActions {
  public client: WebhookClient

  constructor(client: WebhookClient) {
    this.client = client
  }

  async createMessage(data: WebhookMessageCreateData, query: RawExecuteWebhookQuery = {}): RestFinishedResponse<RawMessageData> {
    const request = this.client.internals.rest.api()
      .url(Endpoints.WEBHOOK_TOKEN(this.client.id, this.client.token))
      .query(query)

    if (data.files?.length) {
      request.attach(...data.files)
    }

    request.body({
      content: data.content,
      username: data.username,
      avatar_url: data.avatar_url,
      tts: data.tts,
      embeds: data.embeds?.length ? data.embeds : undefined,
      allowed_mentions: data.allowed_mentions,
      thread_name: data.thread_name,
    })

    return request.post()
  }

  async getMessage(messageId: string, threadId?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.WEBHOOK_MESSAGE(this.client.id, this.client.token, messageId))
      .query({ thread_id: threadId })
      .get()
  }

  async deleteMessage(messageId: string, threadId?: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.WEBHOOK_MESSAGE(this.client.id, this.client.token, messageId))
      .query({ thread_id: threadId })
      .delete({ reason })
  }
}