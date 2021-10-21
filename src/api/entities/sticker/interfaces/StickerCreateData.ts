import { BufferResolvable } from '@src/utils/interfaces/BufferResolvable'
import { MessageAttachmentResolvable } from '@src/api'

export interface StickerCreateData {
  name: string
  description?: string
  tags: string[]
  file: BufferResolvable | MessageAttachmentResolvable
}
