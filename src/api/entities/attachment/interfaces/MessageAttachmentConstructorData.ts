import { BufferResolvable } from '@src/utils/interfaces/BufferResolvable'

export interface MessageAttachmentConstructorData {
  file: BufferResolvable
  name?: string
  spoiler?: boolean
}
