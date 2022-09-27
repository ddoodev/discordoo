import { MessageEmbedResolvable } from '@src/api/entities/embed'
import { MessageAttachmentResolvable } from '@src/api/entities/attachment/interfaces'
import { StickerResolvable } from '@src/api'
import { MessageReferenceResolvable } from '@src/api/entities/message/interfaces/MessageReferenceResolvable'

export interface MessageCreateOptions {
  files?: MessageAttachmentResolvable[]
  file?: MessageAttachmentResolvable

  embeds?: MessageEmbedResolvable[]
  embed?: MessageEmbedResolvable

  stickers?: StickerResolvable[]
  sticker?: StickerResolvable

  components?: any[] /* TODO: MessageComponentResolvable[] */
  component?: any /* TODO: MessageComponentResolvable */

  allowedMentions?: any /* TODO: AllowedMentionsResolvable */
  messageReference?: MessageReferenceResolvable

  content?: string
  tts?: boolean
  nonce?: string
}

export interface WebhookMessageCreateOptions extends Omit<MessageCreateOptions, 'messageReference' | 'stickers' | 'sticker' | 'nonce'> {
  /** Override the default username of the webhook */
  username?: string
  /** Override the default avatar of the webhook */
  avatarUrl?: string
  /** Name of thread to create (requires the webhook channel to be a forum channel) */
  threadName?: string
  /** Send a message to the specified thread within a webhook's channel. The thread will automatically be unarchived. */
  threadId?: string
  /** Suppress embeds for this message or not (use MessageFlags.SUPPRESS_EMBEDS if you want to do this) */
  flags?: 4 // only MessageFlags.SUPPRESS_EMBEDS can be set
}