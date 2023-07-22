import { AbstractEventContext } from '@src/events/interfaces/AbstractEventContext'
import { AnyThreadChannel } from '@src/api/entities/channel/interfaces/AnyThreadChannel'

export interface ThreadCreateEventContext extends AbstractEventContext {
  thread: AnyThreadChannel
  threadId: string
  guildId: string
}