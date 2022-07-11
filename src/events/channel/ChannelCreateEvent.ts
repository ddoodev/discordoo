import { AbstractEvent } from '@src/events'
import { ChannelTypes, EventNames } from '@src/constants'
import { channelEntityKey } from '@src/utils'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { ChannelCreateEventContext } from '@src/events/channel/ctx/ChannelCreateEventContext'
import { AnyRawChannelData } from '@src/api/entities/channel/interfaces/AnyRawGuildChannelData'
import { AnyChannel } from '@src/api'

export class ChannelCreateEvent extends AbstractEvent {
  public name = EventNames.CHANNEL_CREATE

  async execute(shardId: number, data: AnyRawChannelData) {

    const entityKey = channelEntityKey(data)
    if (entityKey === 'AbstractChannel') {
      // TODO: log about unknown channel
      return
    }

    const Channel: any = EntitiesUtil.get(entityKey)

    const channel: AnyChannel = await new Channel(this.client).init(data)

    await this.client.channels.cache.set(channel.id, channel, {
      storage:
        'guildId' in channel
          ? channel.guildId
          : channel.type === ChannelTypes.DM || channel.type === ChannelTypes.GROUP_DM
            ? 'dm'
            : 'unknown',
    })

    const context: ChannelCreateEventContext = {
      channel,
      shardId,
      channelId: channel.id,
      guildId: 'guildId' in channel ? channel.guildId : undefined,
    }

    this.client.emit(EventNames.CHANNEL_CREATE, context)
  }
}