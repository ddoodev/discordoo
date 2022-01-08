import { AppCommandOptionTypes, ChannelTypes } from '@src/constants'
import { AppCommandOptionChoiceData } from '@src/api/entities/interaction/interfaces/AppCommandOptionChoiceData'

export interface RawAppCommandOptionData {
  /** the type of option */
  type: AppCommandOptionTypes
  /** 1-32 character name */
  name: string
  /** 1-100 character description */
  description: string
  /**
   * if the parameter is required or optional
   * @default false
   * */
  required?: boolean
  /** choices for `STRING`, `INTEGER`, and `NUMBER` types for the user to pick from, max 25 */
  choices?: AppCommandOptionChoiceData[]
  /** if the option is a subcommand or subcommand group type, these nested options will be the parameters */
  options?: RawAppCommandOptionData[]
  /** if the option is a channel type, the channels shown will be restricted to these types */
  channel_types?: ChannelTypes[]
  /** if the option is an `INTEGER` or `NUMBER` type, the minimum value permitted */
  min_value?: number
  /** if the option is an `INTEGER` or `NUMBER` type, the maximum value permitted */
  max_value?: number
  /**
   * enable autocomplete interactions for this option.
   * autocomplete may not be set to true if choices are present.
   * options using autocomplete are not confined to only use choices given by the application.
   * */
  autocomplete?: boolean
}