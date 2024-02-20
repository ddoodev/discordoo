import { AbstractEventContext } from '@src/events'
import { Message } from '@src/api'

export interface MessageDeleteBulkEventContext extends AbstractEventContext {
  messageIds: string[]
  messages: Message[]
  channelId: string
  guildId?: string
}