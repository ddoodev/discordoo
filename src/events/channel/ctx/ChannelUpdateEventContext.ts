import { AbstractEventContext } from '@src/events/interfaces/AbstractEventContext'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'

export interface ChannelUpdateEventContext extends AbstractEventContext {
  stored?: AnyGuildChannel
  updated: AnyGuildChannel
  channelId: string
  guildId: string
}