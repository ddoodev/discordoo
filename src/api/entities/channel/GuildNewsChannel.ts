import { AbstractGuildChannel } from '@src/api/entities/channel/AbstractGuildChannel'
import { ChannelTypes } from '@src/constants'
import { ChannelResolvable } from '@src/api'

export class GuildNewsChannel extends AbstractGuildChannel { // TODO: check if writable
  public declare type: ChannelTypes.GUILD_NEWS

  async follow(follower: ChannelResolvable, reason?: string): Promise<this | undefined> {
    const response = await this.client.channels.addFollower(this.id, follower, reason)
    return response ? this : undefined
  }
}
