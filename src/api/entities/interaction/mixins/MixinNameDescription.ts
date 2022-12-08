import { DiscordLocale } from '@src/constants'
import { attach } from '@src/utils'
import { MixinNameDescriptionData } from '@src/api/entities/interaction/mixins/interfaces/MixinNameDescriptionData'
import { RawMixinNameDescriptionData } from '@src/api/entities/interaction/mixins/interfaces/RawMixinNameDescriptionData'

export class MixinNameDescription {
  name!: string
  nameLocalizations?: Record<DiscordLocale, string>
  description!: string
  descriptionLocalizations?: Record<DiscordLocale, string>

  constructor(data: MixinNameDescription | RawMixinNameDescriptionData | MixinNameDescriptionData) {
    attach(this, data, {
      props: [ 'name', 'description' ],
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
