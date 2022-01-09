import { AbstractEvent } from '@src/events'
import { EventNames, Keyspaces } from '@src/constants'
import { AnyRawGuildChannelData } from '@src/api/entities/channel/interfaces/AnyRawGuildChannelData'
import { channelEntityKey } from '@src/utils'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { ChannelDeleteEventContext } from '@src/events/channel/ctx/ChannelDeleteEventContext'

export class ChannelDeleteEvent extends AbstractEvent {
  public name = EventNames.CHANNEL_DELETE

  async execute(shardId: number, data: AnyRawGuildChannelData) {

    const entityKey = channelEntityKey(data)
    if (entityKey === 'AbstractChannel') {
      // TODO: log about unknown channel
      return
    }

    const Channel: any = EntitiesUtil.get(entityKey)

    let channel = await this.client.internals.cache.get(
      Keyspaces.CHANNELS,
      data.guild_id,
      'channelEntityKey',
      data.id,
    )

    if (channel) {
      channel = await channel.init({ ...data, deleted: true })
    } else {
      channel = await new Channel(this.client).init({ ...data, deleted: true })
    }

    await this.client.internals.cache.delete(
      Keyspaces.CHANNELS,
      data.guild_id,
      data.id
    )

    const context: ChannelDeleteEventContext = {
      channel,
      shardId,
      channelId: channel.id,
      guildId: channel.guildId,
    }

    this.client.emit(EventNames.CHANNEL_DELETE, context)
  }
}