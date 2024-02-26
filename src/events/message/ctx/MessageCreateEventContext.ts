import { Message, User } from '@src/api'
import { AnyWritableChannel } from '@src/api/entities/channel/interfaces/AnyWritableChannel'
import { AbstractEventContext } from '@src/events'

export interface MessageCreateEventContext extends AbstractEventContext {
  messageId: string
  message: Message
  authorId: string
  author: User
  channelId: string
  channel?: AnyWritableChannel
}
