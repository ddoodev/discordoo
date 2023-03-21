import { WebhookApplication } from '@src/core/apps/webhook/WebhookApplication'
import {
  MessageContent,
  MessageResolvable,
  RawMessageData,
  ThreadChannelResolvable,
  WebhookMessageCreateOptions
} from '@src/api'
import { createMessagePayload, DiscordooError, resolveChannelId, resolveMessageId } from '@src/utils'
import { MessageFlags } from '@src/constants'
import { DeleteWebhookMessageOptions } from '@src/api/managers/messages/DeleteWebhookMessageOptions'

export class WebhookClientMessagesManager {
  public app: WebhookApplication

  constructor(app: WebhookApplication) {
    this.app = app
  }

  async create(content: MessageContent, options: WebhookMessageCreateOptions = {}): Promise<RawMessageData | undefined> {
    const payload = await createMessagePayload(content, options)

    const response = await this.app.internals.actions.createMessage({
      ...payload,
      avatar_url: options.avatarUrl,
      username: options.username,
      thread_name: options.threadName,
      flags: options.flags !== MessageFlags.SuppressEmbeds ? undefined : options.flags,
    }, { wait: true, thread_id: options.threadId })

    return response.success ? response.result : undefined
  }

  async fetch(message: MessageResolvable, thread?: ThreadChannelResolvable): Promise<RawMessageData | undefined> {
    const messageId = resolveMessageId(message)

    if (!messageId) throw new DiscordooError(
      'WebhookClientMessagesManager#fetch', 'Cannot fetch message without message id.'
    )

    const threadId = thread ? resolveChannelId(thread) : undefined

    const response = await this.app.internals.actions.getMessage(messageId, threadId)

    return response.success ? response.result : undefined
  }

  async delete(message: MessageResolvable, options: DeleteWebhookMessageOptions = {}): Promise<boolean> {
    const messageId = resolveMessageId(message)

    if (!messageId) throw new DiscordooError(
      'WebhookClientMessagesManager#delete', 'Cannot delete message without message id.'
    )

    const threadId = options.thread ? resolveChannelId(options.thread) : undefined

    const response = await this.app.internals.actions.deleteMessage(messageId, threadId, options.reason)

    return response.success
  }
}