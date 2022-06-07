import { AbstractThreadChannel } from '@src/api/entities/channel/AbstractThreadChannel'
import { ChannelTypes } from '@src/constants'

export class GuildThreadChannel extends AbstractThreadChannel {
  public declare type: ChannelTypes.GUILD_PUBLIC_THREAD | ChannelTypes.GUILD_PRIVATE_THREAD
}
