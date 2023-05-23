import {
  AppCommandOptionChoiceData,
  AppCommandOptionWithSubcommandsData,
  RawAppCommandAbstractOptionData, RawAppCommandOptionChoiceData,
  RawAppCommandOptionWithSubcommandsData
} from '@src/api'
import { attach } from '@src/utils/attach'

export function appCommandOptionToRaw(
  option: AppCommandOptionWithSubcommandsData | RawAppCommandOptionWithSubcommandsData
): RawAppCommandOptionWithSubcommandsData {
  const rawOptions: RawAppCommandAbstractOptionData & Pick<RawAppCommandOptionWithSubcommandsData, 'type'> = {
    type: option.type,
    name: option.name,
    description: option.description,
  }

  attach(rawOptions, option, {
    props: [
      'required',
      'autocomplete',
      [ 'name_localizations', 'nameLocalizations' ],
      [ 'description_localizations', 'descriptionLocalizations' ],
      [ 'min_value', 'minValue' ],
      [ 'max_value', 'maxValue' ],
      [ 'min_length', 'minLength' ],
      [ 'max_length', 'maxLength' ],
      [ 'channel_types', 'channelTypes' ]
    ]
  })

  if ('choices' in option) rawOptions['choices'] = option.choices?.map((choice) => ({
    name: choice.name,
    name_localizations: 'nameLocalizations' in choice ? choice.nameLocalizations : choice.name_localizations,
    value: choice.value,
  }))

  if ('options' in option) option.options?.map(option => appCommandOptionToRaw(option))

  return rawOptions as RawAppCommandOptionWithSubcommandsData
}
