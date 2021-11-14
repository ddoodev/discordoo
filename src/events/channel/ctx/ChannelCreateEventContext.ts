import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { AbstractEventContext } from '@src/events/interfaces/AbstractEventContext'

export interface ChannelCreateEventContext extends AbstractEventContext {
  channel: AnyGuildChannel
  guildId: string
  channelId: string
}