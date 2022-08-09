import { ChannelTypes } from '@src/constants'
import { ChannelResolvable } from '@src/api'
import { AbstractGuildTextChannel } from '@src/api/entities/channel/AbstractGuildTextChannel'

export class GuildNewsChannel extends AbstractGuildTextChannel {
  public declare type: ChannelTypes.GUILD_NEWS

  async follow(follower: ChannelResolvable, reason?: string): Promise<this | undefined> {
    const response = await this.client.channels.addFollower(this.id, follower, reason)
    return response ? this : undefined
  }
}
