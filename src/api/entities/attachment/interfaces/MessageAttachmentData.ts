import { BufferResolvable } from '@src/api/entities/interfaces/BufferResolvable'

export interface MessageAttachmentData {
  file: BufferResolvable
  name?: string
  spoiler?: boolean
  ephemeral?: boolean
}
