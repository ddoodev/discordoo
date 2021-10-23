import { AbstractEmoji } from '@src/api/entities/emoji/AbstractEmoji'
import { AbstractGuildEmoji } from '@src/api/entities/emoji/interfaces/AbstractGuildEmoji'
import { GuildPreviewEmojiData } from '@src/api/entities/emoji/interfaces/GuildPreviewEmojiData'
import { RawGuildPreviewEmojiData } from '@src/api/entities/emoji/interfaces/RawGuildPreviewEmojiData'
import { attach } from '@src/utils'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { Json } from '@src/api/entities/interfaces/Json'

export class GuildPreviewEmoji extends AbstractEmoji implements AbstractGuildEmoji {
  public available!: boolean
  public guildId!: string
  public managed!: boolean
  public requiresColons!: boolean

  async init(data: GuildPreviewEmojiData | RawGuildPreviewEmojiData): Promise<this> {
    await super.init(data)

    attach(this, data, [
      [ 'available', '', false ],
      [ 'managed', '', false ],
      [ 'requiresColons', 'requires_colons', false ],
      [ 'guildId', 'guild_id' ],
    ])

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
