import { AbstractEvent } from '@src/events'
import { EventNames } from '@src/constants'
import { channelEntityKey } from '@src/utils'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { ChannelCreateEventContext } from '@src/events/channel/ctx/ChannelCreateEventContext'
import { AnyRawGuildChannelData } from '@src/api/entities/channel/interfaces/AnyRawGuildChannelData'

export class ChannelCreateEvent extends AbstractEvent {
  public name = EventNames.CHANNEL_CREATE

  async execute(shardId: number, data: AnyRawGuildChannelData) {

    const entityKey = channelEntityKey(data)
    if (entityKey === 'AbstractChannel') {
      // TODO: log about unknown channel
      return
    }

    const Channel: any = EntitiesUtil.get(entityKey)

    const channel: AnyGuildChannel = await new Channel(this.client).init(data)

    await this.client.channels.cache.set(channel.id, channel, { storage: channel.guildId })

    const context: ChannelCreateEventContext = {
      channel,
      shardId,
      channelId: channel.id,
      guildId: channel.guildId,
    }

    this.client.emit(EventNames.CHANNEL_CREATE, context)

  }
}