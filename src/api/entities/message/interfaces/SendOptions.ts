export interface SendOptions {
  files?: any[] /* TODO: MessageAttachmentResolvable[] */
  file?: any /* TODO: MessageAttachmentResolvable */

  embeds?: any[] /* TODO: MessageEmbedResolvable[] */
  embed?: any /* TODO: MessageEmbedResolvable */

  stickers?: any[] /* TODO: StickerResolvable[] */
  sticker?: any /* TODO: StickerResolvable */

  components?: any[] /* TODO: MessageComponentResolvable[] */
  component?: any /* TODO: MessageComponentResolvable */

  content?: string
  tts?: boolean
  nonce?: string
}
