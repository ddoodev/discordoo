import { Message, User } from '@src/api'
import { AnyWritableChannel } from '@src/api/entities/channel/interfaces/AnyWritableChannel'

export interface MessageCreateEventContext {
  messageId: string
  message: Message
  authorId: string
  author: User
  channelId: string
  channel?: AnyWritableChannel
}
