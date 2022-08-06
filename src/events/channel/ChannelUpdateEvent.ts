import { AbstractEvent, AbstractEventContext } from '@src/events'
import { EventNames } from '@src/constants'
import { AnyRawChannelData } from '@src/api/entities/channel/interfaces/AnyRawGuildChannelData'
import { channelEntityKey } from '@src/utils'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { ChannelUpdateEventContext } from '@src/events/channel/ctx/ChannelUpdateEventContext'

export class ChannelUpdateEvent extends AbstractEvent<ChannelUpdateEventContext | AbstractEventContext> {
  public name = EventNames.CHANNEL_UPDATE

  async execute(shardId: number, data: AnyRawChannelData) {
    const entityKey = channelEntityKey(data)
    if (entityKey === 'AbstractChannel') {
      // TODO: log about unknown channel
      return {
        shardId,
      }
    }

    const Channel: any = EntitiesUtil.get(entityKey)

    const stored = await this.client.channels.cache.get(data.id, { storage: data.guild_id ?? 'dm' })
    const updated = stored ? await (await stored._clone() as any).init(data) : await new Channel(this.client).init(data)

    await this.client.channels.cache.set(updated.id, updated, { storage: data.guild_id ?? 'dm' })

    const context: ChannelUpdateEventContext = {
      shardId,
      stored,
      updated,
      channelId: data.id,
      guildId: data.guild_id
    }

    this.client.emit(EventNames.CHANNEL_UPDATE, context)
    return context
  }
}