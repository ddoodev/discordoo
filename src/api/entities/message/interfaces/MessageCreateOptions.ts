import { MessageEmbedResolvable } from '@src/api/entities/embed'
import { MessageAttachmentResolvable } from '@src/api/entities/attachment/interfaces'
import { ActionRowResolvable, AllowedMentionsResolvable, StickerResolvable } from '@src/api'
import { MessageReferenceResolvable } from '@src/api/entities/message/interfaces/MessageReferenceResolvable'

export interface MessageCreateOptions {
  files?: MessageAttachmentResolvable[]
  file?: MessageAttachmentResolvable

  embeds?: MessageEmbedResolvable[]
  embed?: MessageEmbedResolvable

  stickers?: StickerResolvable[]
  sticker?: StickerResolvable

  components?: ActionRowResolvable[]
  component?: ActionRowResolvable

  allowedMentions?: AllowedMentionsResolvable
  messageReference?: MessageReferenceResolvable

  content?: string
  tts?: boolean
  nonce?: string
  /** Suppress embeds for this message or not (use MessageFlags.SuppressEmbeds if you want to do this) */
  flags?: 4 // only MessageFlags.SuppressEmbeds can be set
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
}

export interface InteractionMessageCreateOptions
  extends Omit<MessageCreateOptions, 'messageReference' | 'stickers' | 'sticker' | 'nonce' | 'flags'> {
  /** Flag to send the message as ephemeral or suppress embeds in it or both (use MessageFlags if you want to do this) */
  flags?: 4 | 64 | 68 // only MessageFlags.SuppressEmbeds and MessageFlags.Ephemeral can be set
}
