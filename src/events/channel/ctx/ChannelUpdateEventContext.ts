import { AbstractEventContext } from '../../../../src/events/interfaces/AbstractEventContext'
import { AnyChannel } from '../../../../src/api'

export interface ChannelUpdateEventContext extends AbstractEventContext {
  stored?: AnyChannel
  updated: AnyChannel
  channelId: string
  guildId?: string
}