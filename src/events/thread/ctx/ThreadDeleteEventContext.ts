import { AbstractEventContext } from '@src/events/interfaces/AbstractEventContext'
import { AnyThreadChannel } from '@src/api/entities/channel/interfaces/AnyThreadChannel'

export interface ThreadDeleteEventContext extends AbstractEventContext {
  thread: AnyThreadChannel
  threadId: string
  threadParentId: string
  guildId: string
}