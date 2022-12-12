// @ts-nocheck
import { RawAppCommandOptionData, AppCommandOptionWithSubcommandsData } from '@src/api'

export function optionToRaw(option: AppCommandOptionWithSubcommandsData | RawAppCommandOptionData): RawAppCommandOptionData {
  return {
    type: option.type,
    name: option.name,
    description: option.description,
    required: option.required,
    choices: option.choices?.map(choice => ({
      name: choice.name,
      name_localizations: 'nameLocalizations' in choice ? choice.nameLocalizations : choice.name_localizations,
      value: choice.value,
    })),
    autocomplete: option.autocomplete,
    options: option.options?.map(option => optionToRaw(option)),
    min_value: 'minValue' in option ? option.minValue : option.min_value,
    max_value: 'maxValue' in option ? option.maxValue : option.max_value,
    channel_types: 'channelTypes' in option ? option.channelTypes : option.channel_types,
  }
}