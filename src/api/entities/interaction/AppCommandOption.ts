import { AppCommandOptionTypes, DiscordLocale } from '../../../../src/constants'
import {
  AppCommandOptionChoiceData,
  AppCommandOptionWithSubcommandsData,
  RawAppCommandOptionWithSubcommandsData
} from '../../../../src/api'
import { EntityInitOptions } from '../../../../src/api/entities/EntityInitOptions'
import { attach } from '../../../../src/utils'

export class AppCommandOption {
  declare name: string
  declare nameLocalizations?: Record<DiscordLocale, string>
  declare description: string
  declare descriptionLocalizations?: Record<DiscordLocale, string>
  declare choices?: AppCommandOptionChoiceData[]
  declare options?: AppCommandOption[]
  declare required: boolean
  declare value:
    (this['type'] extends AppCommandOptionTypes.String ? string : number)
    | (this['required'] extends true ? never : undefined)
  declare type: AppCommandOptionTypes
  declare autocomplete?: boolean

  constructor(data: AppCommandOptionWithSubcommandsData | RawAppCommandOptionWithSubcommandsData, options?: EntityInitOptions) {
    attach(this, data, {
      props: [
        'name',
        [ 'nameLocalizations', 'name_localizations' ],
        'description',
        [ 'descriptionLocalizations', 'description_localizations' ],
        'required',
        'value',
        'type',
        'autocomplete'
      ],
      disabled: options?.ignore,
      enabled: [ 'name', 'type' ]
    })

    if ('choices' in data && data.choices) {
      this.choices = data.choices.map(choice => ({
        name: choice.name,
        value: choice.value,
        nameLocalizations: choice.nameLocalizations ?? choice.name_localizations
      }))
    }

    if ('options' in data && data.options) {
      this.options = data.options.map(option => new AppCommandOption(option, options))
    }
  }

  jsonify(): AppCommandOptionWithSubcommandsData {
    return { ...this } as AppCommandOptionWithSubcommandsData
  }
}
