import { AbstractEventContext } from '@src/events/interfaces/AbstractEventContext'
import { AnyWritableChannel } from '@src/api/entities/channel/interfaces/AnyWritableChannel'

export interface ChannelPinsUpdateEventContext extends AbstractEventContext {
  channelId: string
  channel?: AnyWritableChannel
  guildId?: string
  lastPinTimestamp?: number
  lastPinDate?: Date
}