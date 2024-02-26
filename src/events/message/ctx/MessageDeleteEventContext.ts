import { AbstractEventContext } from '@src/events'
import { Message } from '@src/api'

export interface MessageDeleteEventContext extends AbstractEventContext {
  messageId: string
  message?: Message
  channelId: string
  guildId?: string
}