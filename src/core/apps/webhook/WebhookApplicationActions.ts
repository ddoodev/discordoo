import { Endpoints } from '../../../../src/constants'
import { RawMessageData, WebhookMessageCreateData } from '../../../../src/api'
import { RawExecuteWebhookQuery, WebhookApplication } from '../../../../src/core'
import { RestFinishedResponse } from '../../../../../providers/src/_index'

export class WebhookApplicationActions {
  public app: WebhookApplication

  constructor(app: WebhookApplication) {
    this.app = app
  }

  async createMessage(data: WebhookMessageCreateData, query: RawExecuteWebhookQuery = {}): RestFinishedResponse<RawMessageData> {
    const request = this.app.internals.rest.api()
      .url(Endpoints.WEBHOOK_TOKEN(this.app.id, this.app.token))
      .query(query)

    if (data.attachments?.length) {
      request.attach(...data.attachments)
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
    return this.app.internals.rest.api()
      .url(Endpoints.WEBHOOK_MESSAGE(this.app.id, this.app.token, messageId))
      .query({ thread_id: threadId })
      .get()
  }

  async deleteMessage(messageId: string, threadId?: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.WEBHOOK_MESSAGE(this.app.id, this.app.token, messageId))
      .query({ thread_id: threadId })
      .delete({ reason })
  }
}
