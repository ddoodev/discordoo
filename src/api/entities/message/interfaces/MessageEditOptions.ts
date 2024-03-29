import {
  ActionRowResolvable, AllowedMentionsResolvable,
  MessageAttachmentResolvable,
  MessageEmbedResolvable, MessageResolvable,
} from '@src/api'

export interface MessageEditOptions {
  files?: MessageAttachmentResolvable[]
  file?: MessageAttachmentResolvable

  embeds?: MessageEmbedResolvable[]
  embed?: MessageEmbedResolvable

  components?: ActionRowResolvable[]
  component?: ActionRowResolvable

  allowedMentions?: AllowedMentionsResolvable

  content?: string
  /** Suppress embeds for this message or not (use MessageFlags.SuppressEmbeds if you want to do this) */
  flags?: 4 // only MessageFlags.SuppressEmbeds can be set
}

export interface InteractionMessageEditOptions extends MessageEditOptions {
  message?: MessageResolvable
}
