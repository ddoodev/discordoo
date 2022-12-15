import { MessageAttachment } from '@src/api/entities/attachment/MessageAttachment'
import { MessageAttachmentBuilderData, RawMessageAttachmentData } from '@src/api/entities/attachment/interfaces'
import { MessageAttachmentBuilder } from '@src/api'

export type MessageAttachmentResolvable =
  MessageAttachmentBuilder | MessageAttachment | MessageAttachmentBuilderData | RawMessageAttachmentData
