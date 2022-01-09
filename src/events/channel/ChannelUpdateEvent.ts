import { AbstractEvent } from '@src/events'
import { EventNames, Keyspaces } from '@src/constants'
import { AnyRawGuildChannelData } from '@src/api/entities/channel/interfaces/AnyRawGuildChannelData'
import { channelEntityKey } from '@src/utils'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { ChannelUpdateEventContext } from '@src/events/channel/ctx/ChannelUpdateEventContext'

export class ChannelUpdateEvent extends AbstractEvent {
  public name = EventNames.CHANNEL_UPDATE

  async execute(shardId: number, data: AnyRawGuildChannelData) {
    const entityKey = channelEntityKey(data)
    if (entityKey === 'AbstractChannel') {
      // TODO: log about unknown channel
      return
    }

    const Channel: any = EntitiesUtil.get(entityKey)

    const stored = await this.client.internals.cache.get<string, AnyGuildChannel>(
      Keyspaces.CHANNELS,
      data.guild_id,
      'channelEntityKey',
      data.id
    )

    const updated = stored ? await (await stored._clone()).init(data) : await new Channel(this.client).init(data)

    await this.client.channels.cache.set(updated.id, updated, { storage: data.guild_id })

    const context: ChannelUpdateEventContext = {
      shardId,
      stored,
      updated,
      channelId: data.id,
      guildId: data.guild_id
    }

    this.client.emit(EventNames.CHANNEL_UPDATE, context)
  }
}