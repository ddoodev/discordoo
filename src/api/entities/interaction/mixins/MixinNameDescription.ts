import { DiscordLocale } from '@src/constants'
import { attach } from '@src/utils'
import { MixinNameDescriptionData } from '@src/api/entities/interaction/mixins/interfaces/MixinNameDescriptionData'
import { RawMixinNameDescriptionData } from '@src/api/entities/interaction/mixins/interfaces/RawMixinNameDescriptionData'
export class MixinNameDescription {
  declare name: string
  public nameLocalizations?: Record<DiscordLocale, string>
  declare description: string
  public descriptionLocalizations?: Record<DiscordLocale, string>

  constructor(data: MixinNameDescription | RawMixinNameDescriptionData | MixinNameDescriptionData) {
    attach(this, data, {
      props: [
        'name',
        'description',
        [ 'nameLocalizations', 'name_localizations' ],
        [ 'descriptionLocalizations', 'description_localizations' ]
      ],
    })
  }

  setName(name: string): this {
    this.name = name
    return this
  }

  setDescription(description: string): this {
    this.description = description
    return this
  }

  setNameLocalization(data: Record<DiscordLocale, string>): this {
    this.nameLocalizations = data
    return this
  }

  setDescriptionLocalization(data: Record<DiscordLocale, string>): this {
    this.descriptionLocalizations = data
    return this
  }
}
