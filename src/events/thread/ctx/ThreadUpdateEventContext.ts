import { AbstractEventContext } from '@src/events/interfaces/AbstractEventContext'
import { AnyThreadChannel } from '@src/api/entities/channel/interfaces/AnyThreadChannel'

export interface ThreadUpdateEventContext extends AbstractEventContext {
  stored?: AnyThreadChannel
  updated: AnyThreadChannel
  threadId: string
  guildId: string
}