import { BufferResolvable } from '@src/utils/interfaces/BufferResolvable'

export interface MessageAttachmentData {
  file: BufferResolvable
  name?: string
  spoiler?: boolean
  ephemeral?: boolean
}
