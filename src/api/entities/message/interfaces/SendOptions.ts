import { MessageEmbedResolvable } from '@src/api/entities/embed'
import { MessageAttachmentResolvable } from '@src/api/entities/attachment/interfaces' // thanks typescript for cool circular deps resolving

export interface SendOptions {
  files?: MessageAttachmentResolvable[]
  file?: MessageAttachmentResolvable

  embeds?: MessageEmbedResolvable[]
  embed?: MessageEmbedResolvable

  stickers?: any[] /* TODO: StickerResolvable[] */
  sticker?: any /* TODO: StickerResolvable */

  components?: any[] /* TODO: MessageComponentResolvable[] */
  component?: any /* TODO: MessageComponentResolvable */

  allowedMentions?: any /* TODO: AllowedMentionsResolvable */
  messageReference?: any /* TODO: MessageReferenceResolvable */

  content?: string
  tts?: boolean
  nonce?: string
}
