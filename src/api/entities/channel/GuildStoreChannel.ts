import { AbstractGuildChannel } from '@src/api/entities/channel/AbstractGuildChannel'
import { ChannelTypes } from '@src/constants'
import { GuildStoreChannelData } from '@src/api/entities/channel/interfaces/GuildStoreChannelData'
import { RawGuildStoreChannelData } from '@src/api/entities/channel/interfaces/RawGuildStoreChannelData'
import { Json, ToJsonProperties } from '@src/api'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'
import { attach } from '@src/utils'

export class GuildStoreChannel extends AbstractGuildChannel {
  public declare type: ChannelTypes.GuildStore
  public nsfw?: boolean

  async init(data: GuildStoreChannelData | RawGuildStoreChannelData, options?: EntityInitOptions): Promise<this> {
    await super.init(data, options)

    attach(this, data, {
      props: [
        'nsfw'
      ],
      disabled: options?.ignore
    })

    return this
  }

  jsonify(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.jsonify({
      ...properties,
      nsfw: true,
    }, obj)
  }
}
