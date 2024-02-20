import { Message } from '@src/api'
import { AbstractEventContext } from '@src/events'

export interface MessageUpdateEventContext extends AbstractEventContext {
  stored?: Message
  updated: Message
  messageId: string
  channelId: string
}
