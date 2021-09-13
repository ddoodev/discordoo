import { MessageAttachment } from '@src/api/entities/attachment/MessageAttachment'
import { BufferResolvable } from '@src/api/entities/interfaces/BufferResolvable'

export type MessageAttachmentResolvable = MessageAttachment | BufferResolvable | { name: string; data: BufferResolvable }
