import { MessageAttachment } from '@src/api/entities/attachment/MessageAttachment'
import { MessageAttachmentData, RawMessageAttachmentData } from '@src/api/entities/attachment/interfaces'

export type MessageAttachmentResolvable =
  MessageAttachment | MessageAttachmentData | RawMessageAttachmentData
