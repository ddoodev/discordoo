import { MessageEmbedResolvable } from '@src/api/entities/embed'
import { StickerResolvable } from '@src/api/entities/sticker'
import { MessageAttachmentResolvable } from '@src/api'

export type MessageContent = MessageEmbedResolvable
  | MessageEmbedResolvable[]
  | MessageAttachmentResolvable
  | MessageAttachmentResolvable[]
  | StickerResolvable
  | StickerResolvable[]
  | string | number

export type InteractionMessageContent = Exclude<MessageContent, StickerResolvable | StickerResolvable[]> | string | number