import { AbstractEventContext } from '@src/events/interfaces/AbstractEventContext'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'

export interface ChannelDeleteEventContext extends AbstractEventContext {
  channel: AnyGuildChannel
  channelId: string
  guildId: string
}