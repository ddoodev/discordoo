import { MessageAttachment } from '@src/api/entities/attachment/MessageAttachment'
import { MessageAttachmentConstructorData, RawMessageAttachmentData } from '@src/api/entities/attachment/interfaces'
import { MessageAttachmentConstructor } from '@src/api'

export type MessageAttachmentResolvable =
  MessageAttachmentConstructor | MessageAttachment | MessageAttachmentConstructorData | RawMessageAttachmentData
