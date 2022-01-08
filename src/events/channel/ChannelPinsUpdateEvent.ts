import { AbstractEvent } from '@src/events'
import { EventNames, Keyspaces } from '@src/constants'
import { RawChannelPinsUpdateEventData } from '@src/events/channel/RawChannelPinsUpdateEventData'

export class ChannelPinsUpdateEvent extends AbstractEvent {
  public name = EventNames.CHANNEL_PINS_UPDATE

  async execute(shardId: number, data: RawChannelPinsUpdateEventData) {
    const timestamp = data.last_pin_timestamp ? new Date(data.last_pin_timestamp) : undefined

    const channel = await this.client.internals.cache.get(
      Keyspaces.CHANNELS,
      data.guild_id ?? 'global',
      'channelEntityKey',
      data.channel_id
    ) // TODO: reset last pin timestamp

    this.client.emit(EventNames.CHANNEL_PINS_UPDATE, {
      shardId,
      channel,
      channelId: data.channel_id,
      guildId: data.guild_id,
      lastPinDate: timestamp,
      lastPinTimestamp: timestamp?.getTime()
    })
  }
}