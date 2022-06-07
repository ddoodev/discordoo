import { AbstractGuildTextChannel } from '@src/api/entities/channel/AbstractGuildTextChannel'
import { GuildTextChannelData } from '@src/api/entities/channel/interfaces/GuildTextChannelData'
import { RawGuildTextChannelData } from '@src/api/entities/channel/interfaces/RawGuildTextChannelData'
import { attach } from '@src/utils'
import { ChannelTypes } from '@src/constants'
import { Json, ToJsonProperties } from '@src/api'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class GuildTextChannel extends AbstractGuildTextChannel {
  public rateLimitPerUser?: number
  public declare type: ChannelTypes.GUILD_TEXT

  async init(data: GuildTextChannelData | RawGuildTextChannelData, options?: EntityInitOptions): Promise<this> {
    await super.init(data, options)

    attach(this, data, {
      props: [
        [ 'rateLimitPerUser', 'rate_limit_per_user' ]
      ],
      disabled: options?.ignore
    })

    return this
  }

  setRateLimitPerUser(limit: number, reason?: string) {
    return this.edit({ rateLimitPerUser: limit }, reason)
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      rateLimitPerUser: true,
    }, obj)
  }

}
