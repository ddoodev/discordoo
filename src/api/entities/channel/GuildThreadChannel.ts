import { AbstractThreadChannel } from '@src/api/entities/channel/AbstractThreadChannel'
import { ChannelTypes } from '@src/constants'

export class GuildThreadChannel extends AbstractThreadChannel {
  public declare type: ChannelTypes.GuildPublicThread | ChannelTypes.GuildPrivateThread
}
