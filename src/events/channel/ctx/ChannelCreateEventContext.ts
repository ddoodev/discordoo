import { AbstractEventContext } from '@src/events/interfaces/AbstractEventContext'
import { AnyChannel } from '@src/api'

export interface ChannelCreateEventContext extends AbstractEventContext {
  channel: AnyChannel
  guildId?: string
  channelId: string
}