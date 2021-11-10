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
