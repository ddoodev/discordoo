import { AbstractGuildChannel } from '@src/api/entities/channel/AbstractGuildChannel'
import { ChannelTypes } from '@src/constants'
import { GuildStoreChannelData } from '@src/api/entities/channel/interfaces/GuildStoreChannelData'
import { RawGuildStoreChannelData } from '@src/api/entities/channel/interfaces/RawGuildStoreChannelData'
import { Json, ToJsonProperties } from '@src/api'

export class GuildStoreChannel extends AbstractGuildChannel {
  public type!: ChannelTypes.GUILD_STORE
  public nsfw!: boolean

  async init(data: GuildStoreChannelData | RawGuildStoreChannelData): Promise<this> {
    await super.init(data)

    this.nsfw = data.nsfw ?? this.nsfw

    return this
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      nsfw: true,
    }, obj)
  }
}
