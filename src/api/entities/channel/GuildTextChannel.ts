import { AbstractGuildTextChannel } from '@src/api/entities/channel/AbstractGuildTextChannel'
import { GuildTextChannelData } from '@src/api/entities/channel/interfaces/GuildTextChannelData'
import { RawGuildTextChannelData } from '@src/api/entities/channel/interfaces/RawGuildTextChannelData'
import { attach } from '@src/utils'
import { ChannelTypes } from '@src/constants'

export class GuildTextChannel extends AbstractGuildTextChannel {
  public rateLimitPerUser?: number
  public type!: ChannelTypes.GUILD_TEXT

  async init(data: GuildTextChannelData | RawGuildTextChannelData): Promise<this> {
    await super.init(data)

    attach(this, data, [
      [ 'rateLimitPerUser', 'rate_limit_per_user' ]
    ])

    return this
  }

  setRateLimitPerUser(limit: number, reason?: string) {
    return this.edit({ rateLimitPerUser: limit }, reason)
  }

}
