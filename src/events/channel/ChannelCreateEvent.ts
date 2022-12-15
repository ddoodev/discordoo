import { AbstractEvent, AbstractEventContext } from '@src/events'
import { ChannelTypes, EventNames } from '@src/constants'
import { channelEntityKey } from '@src/utils'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { ChannelCreateEventContext } from '@src/events/channel/ctx/ChannelCreateEventContext'
import { AnyRawChannelData } from '@src/api/entities/channel/interfaces/AnyRawGuildChannelData'
import { AnyChannel } from '@src/api'

export class ChannelCreateEvent extends AbstractEvent<ChannelCreateEventContext | AbstractEventContext> {
  public name = EventNames.CHANNEL_CREATE

  async execute(shardId: number, data: AnyRawChannelData) {

    const entityKey = channelEntityKey(data)
    if (entityKey === 'AbstractChannel') {
      // TODO: log about unknown channel
      return {
        shardId,
      }
    }

    const Channel: any = EntitiesUtil.get(entityKey)

    const channel: AnyChannel = await new Channel(this.app).init(data)

    await this.app.channels.cache.set(channel.id, channel, {
      storage:
        'guildId' in channel
          ? channel.guildId
          : channel.type === ChannelTypes.Dm // TODO: || channel.type === ChannelTypes.GroupDm
            ? 'dm'
            : 'unknown',
    })

    const context: ChannelCreateEventContext = {
      channel,
      shardId,
      channelId: channel.id,
      guildId: 'guildId' in channel ? channel.guildId : undefined,
    }

    this.app.emit(EventNames.CHANNEL_CREATE, context)
    return context
  }
}