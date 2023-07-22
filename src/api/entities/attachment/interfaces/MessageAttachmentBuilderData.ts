import { BufferResolvable } from '../../../../../src/utils/interfaces/BufferResolvable'

export interface MessageAttachmentBuilderData {
  file: BufferResolvable
  name?: string
  spoiler?: boolean
}
