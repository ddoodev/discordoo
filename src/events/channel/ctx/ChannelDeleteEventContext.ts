import { AbstractEventContext } from '@src/events/interfaces/AbstractEventContext'
import { AnyChannel } from '@src/api'

export interface ChannelDeleteEventContext extends AbstractEventContext {
  channel: AnyChannel
  channelId: string
  guildId?: string
}