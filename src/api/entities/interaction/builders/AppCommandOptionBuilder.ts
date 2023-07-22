import { AppCommandOptionTypes, ChannelTypes, DiscordLocale } from '../../../../../src/constants'
import {
  AppCommandOption,
  AppCommandOptionChoiceData,
  AppCommandOptionWithSubcommandsData,
  RawAppCommandOptionChoiceData,
  RawAppCommandOptionWithSubcommandsData
} from '../../../../../src/api'
import { appCommandOptionToRaw } from '../../../../../src/utils/appCommandOptionToRaw'
import { attach } from '../../../../../src/utils'

export class AppCommandOptionBuilder {
  declare name: string
  declare nameLocalizations?: Record<DiscordLocale, string>
  declare description: string
  declare descriptionLocalizations?: Record<DiscordLocale, string>
  public choices: RawAppCommandOptionChoiceData[] = []
  public options: RawAppCommandOptionWithSubcommandsData[] = []
  declare required: boolean
  declare value: string | number
  declare type: AppCommandOptionTypes
  public minLength?: number
  public maxLength?: number
  public minValue?: number
  public maxValue?: number
  public channelTypes?: ChannelTypes[]

  constructor(
    data?: AppCommandOptionWithSubcommandsData
    | RawAppCommandOptionWithSubcommandsData
    | AppCommandOptionBuilder
  ) {
    if (!data) return this

    attach(this, data, {
      props: [
        'name',
        'required',
        'value',
        'type',
        [ 'descriptionLocalizations', 'description_localizations' ],
        [ 'nameLocalizations', 'name_localizations' ],
      ]
    })

    if ('choices' in data && data.choices) {
      this.addChoices(data.choices)
    }

    if ('options' in data && data.options) {
      this.addOptions(data.options)
    }
  }

  addChoice(choice: AppCommandOptionChoiceData | RawAppCommandOptionChoiceData) {
    let nameLocalizations: Record<DiscordLocale, string> | undefined = undefined
    if ('name_localizations' in choice) {
      nameLocalizations = choice.name_localizations
    } else if ('nameLocalizations' in choice) {
      nameLocalizations = choice.nameLocalizations
    }

    const rawChoiceData: RawAppCommandOptionChoiceData = {
      name: choice.name,
      name_localizations: nameLocalizations,
      value: choice.value
    }

    this.choices.push(rawChoiceData)
    return this
  }

  addChoices(choices: Array<AppCommandOptionChoiceData | RawAppCommandOptionChoiceData>) {
    choices.forEach((data) => this.addChoice(data))
    return this
  }

  addOption(option: RawAppCommandOptionWithSubcommandsData | AppCommandOptionWithSubcommandsData | AppCommandOption) {
    if (option instanceof AppCommandOption) {
      option = option.jsonify()
    }
    this.options.push(appCommandOptionToRaw(option))
    return this
  }

  addOptions(options: Array<RawAppCommandOptionWithSubcommandsData | AppCommandOptionWithSubcommandsData | AppCommandOption>) {
    options.forEach((data) => this.addOption(data))
    return this
  }

  setChannelTypes(channelTypes: ChannelTypes[]) {
    this.channelTypes = channelTypes
    return this
  }

  setDescription(description: string) {
    this.description = description
    return this
  }

  setDescriptionLocalizations(descriptionLocalizations: Record<DiscordLocale, string>) {
    this.descriptionLocalizations = descriptionLocalizations
    return this
  }

  setMaxLength(value: number) {
    this.maxLength = value
    return this
  }

  setMaxValue(value: number) {
    this.maxValue = value
    return this
  }

  setMinLength(value: number) {
    this.minLength = value
    return this
  }

  setMinValue(value: number) {
    this.minValue = value
    return this
  }

  setName(name: string) {
    this.name = name
    return this
  }

  setNameLocalizations(nameLocalizations: Record<DiscordLocale, string>) {
    this.nameLocalizations = nameLocalizations
    return this
  }

  setRequired(required: boolean) {
    this.required = required
    return this
  }

  setType(type: AppCommandOptionTypes) {
    this.type = type
    return this
  }

  setValue(value: string | number) {
    this.value = value
    return this
  }

  toJSON(): RawAppCommandOptionWithSubcommandsData {
    return appCommandOptionToRaw(this as RawAppCommandOptionWithSubcommandsData)
  }
}
