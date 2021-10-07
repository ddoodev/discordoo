import type { MessageAttachment } from '@src/api/entities/attachment/MessageAttachment'
import type { BufferResolvable } from '@src/api/entities/interfaces/BufferResolvable'

export type MessageAttachmentResolvable =
  MessageAttachment | BufferResolvable | { name?: string; data: BufferResolvable; ephemeral?: boolean }
