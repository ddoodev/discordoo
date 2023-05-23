import { AppCommandOptionTypes, ChannelTypes, DiscordLocale } from '@src/constants'
import { AppCommandOptionChoiceData } from '@src/api'

export type AppCommandOptionData = AppCommandStringOptionData
  | AppCommandIntegerOptionData
  | AppCommandNumberOptionData
  | AppCommandBooleanOptionData
  | AppCommandUserOptionData
  | AppCommandChannelOptionData
  | AppCommandRoleOptionData
  | AppCommandMentionableOptionData

export type AppCommandOptionWithSubcommandsData = AppCommandOptionData
  | AppCommandSubcommandOptionData
  | AppCommandSubcommandGroupOptionData

export interface AppCommandAbstractOptionData {
  /** 1-32 character name */
  name: string
  /** localization dictionary for `name` field. values follow the same restrictions as name */
  nameLocalizations?: Record<DiscordLocale, string>
  /** 1-100 character description */
  description: string
  /** localization dictionary for `description` field. values follow the same restrictions as description */
  descriptionLocalizations?: Record<DiscordLocale, string>
  /**
   * if the parameter is required or optional
   * @default false
   * */
  required?: boolean
}

export interface AppCommandSubcommandOptionData extends Omit<AppCommandAbstractOptionData, 'required'> {
  /** the type of option: subcommand */
  type: AppCommandOptionTypes.Subcommand
  /** parameters for the subcommand, max of 25 */
  options?: AppCommandOptionData[]
}

export interface AppCommandSubcommandGroupOptionData extends Omit<AppCommandAbstractOptionData, 'required'> {
  /** the type of option: subcommand group */
  type: AppCommandOptionTypes.SubcommandGroup
  options: AppCommandSubcommandOptionData[]
}

export interface AppCommandStringOptionData extends AppCommandAbstractOptionData {
  /** the type of option: string */
  type: AppCommandOptionTypes.String
  /** choices for `String` type for the user to pick from, max 25 */
  choices?: AppCommandOptionChoiceData[]
  /**
   * enable autocomplete interactions for this option.
   * autocomplete may not be set to true if choices are present.
   * options using autocomplete are not confined to only use choices given by the application.
   * */
  autocomplete?: boolean
  /** minimum string length user can write */
  minLength?: number
  /** maximum string length user can write */
  maxLength?: number
}

export interface AppCommandIntegerOptionData extends AppCommandAbstractOptionData {
  type: AppCommandOptionTypes.Integer
  /** choices for `Integer` type for the user to pick from, max 25 */
  choices?: AppCommandOptionChoiceData[]
  /**
   * enable autocomplete interactions for this option.
   * autocomplete may not be set to true if choices are present.
   * options using autocomplete are not confined to only use choices given by the application.
   * */
  autocomplete?: boolean
  /** for option type `String`, the minimum allowed length (minimum of 0, maximum of 6000) */
  minValue?: number
  /** for option type `String`, the maximum allowed length (minimum of 1, maximum of 6000) */
  maxValue?: number
}

export interface AppCommandNumberOptionData extends AppCommandAbstractOptionData {
  type: AppCommandOptionTypes.Number
  /** choices for `Number` type for the user to pick from, max 25 */
  choices?: AppCommandOptionChoiceData[]
  /**
   * enable autocomplete interactions for this option.
   * autocomplete may not be set to true if choices are present.
   * options using autocomplete are not confined to only use choices given by the application.
   * */
  autocomplete?: boolean
  /** minimum value user can write */
  minValue?: number
  /** maximum value user can write */
  maxValue?: number
}

export interface AppCommandBooleanOptionData extends AppCommandAbstractOptionData {
  type: AppCommandOptionTypes.Boolean
}

export interface AppCommandUserOptionData extends AppCommandAbstractOptionData {
  type: AppCommandOptionTypes.User
}

export interface AppCommandChannelOptionData extends AppCommandAbstractOptionData {
  type: AppCommandOptionTypes.Channel
  channelTypes?: ChannelTypes[]
}

export interface AppCommandRoleOptionData extends AppCommandAbstractOptionData {
  type: AppCommandOptionTypes.Role
}

export interface AppCommandMentionableOptionData extends AppCommandAbstractOptionData {
  type: AppCommandOptionTypes.Mentionable
}
