import { AbstractEmoji } from '@src/api/entities/emoji/AbstractEmoji'
import { AbstractGuildEmoji } from '@src/api/entities/emoji/interfaces/AbstractGuildEmoji'
import { GuildPreviewEmojiData } from '@src/api/entities/emoji/interfaces/GuildPreviewEmojiData'
import { RawGuildPreviewEmojiData } from '@src/api/entities/emoji/interfaces/RawGuildPreviewEmojiData'
import { attach } from '@src/utils'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { Json } from '@src/api/entities/interfaces/Json'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class GuildPreviewEmoji extends AbstractEmoji implements AbstractGuildEmoji {
  public declare available: boolean
  public declare guildId: string
  public declare managed: boolean
  public declare requiresColons: boolean

  async init(data: GuildPreviewEmojiData | RawGuildPreviewEmojiData, options?: EntityInitOptions): Promise<this> {
    await super.init(data, options)

    attach(this, data, {
      props: [
        [ 'available', undefined, false ],
        [ 'managed', undefined, false ],
        [ 'requiresColons', 'requires_colons', false ],
        [ 'guildId', 'guild_id' ],
      ],
      disabled: options?.ignore,
    })

    return this
  }

  toJson(properties: ToJsonProperties, obj?: any): Json {
    return super.toJson({
      ...properties,
      available: true,
      guildId: true,
      managed: true,
      requiresColons: true
    }, obj)
  }

}
