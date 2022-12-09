import { AppCommandOptionTypes, ChannelTypes } from '@src/constants'
import { AppCommandOptionChoiceData } from '@src/api/entities/interaction/interfaces/command/common/AppCommandOptionChoiceData'
import { DiscordLocale } from '@src/constants/common/DiscordLocale'

export interface AppCommandOptionData {
  /** the type of option */
  type: AppCommandOptionTypes
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
  /** choices for `STRING`, `INTEGER`, and `NUMBER` types for the user to pick from, max 25 */
  choices?: AppCommandOptionChoiceData[]
  /** if the option is a subcommand or subcommand group type, these nested options will be the parameters */
  options?: AppCommandOptionData[]
  /** if the option is a channel type, the channels shown will be restricted to these types */
  channelTypes?: ChannelTypes[]
  /** if the option is an `INTEGER` or `NUMBER` type, the minimum value permitted */
  minValue?: number
  /** if the option is an `INTEGER` or `NUMBER` type, the maximum value permitted */
  maxValue?: number
  /**
   * enable autocomplete interactions for this option.
   * autocomplete may not be set to true if choices are present.
   * options using autocomplete are not confined to only use choices given by the application.
   * */
  autocomplete?: boolean
}

export interface AppCommandAbstractOptionData {
  /** 1-32 character name */
  name: string
  /** localization dictionary for `name` field. values follow the same restrictions as name */
  nameLocalizations?: Record<DiscordLocale, string>
  /** 1-100 character description */
  description: string
  /** localization dictionary for `description` field. values follow the same restrictions as description */
  descriptionLocalizations?: Record<DiscordLocale, string>
  /** if the parameter is required or optional */
  required?: boolean
}

export interface AppCommandStringOptionData extends AppCommandAbstractOptionData {
  /** the type of option: string */
  type: AppCommandOptionTypes.String
  /** choices for `STRING`, `INTEGER`, and `NUMBER` types for the user to pick from, max 25 */
  choices?: AppCommandOptionChoiceData[]
  /** enable autocomplete interactions for this option. */
  autocomplete?: boolean
  /** maximum string length */
  maxLength?: number
  /** minimum string length */
  minLength?: number
}

export interface AppCommandOptionIntegerData {
  type: AppCommandOptionTypes.Integer
  name: string
  nameLocalizations?: Record<DiscordLocale, string>
  description: string
  descriptionLocalizations?: Record<DiscordLocale, string>
  required?: boolean
  choices?: AppCommandOptionChoiceData[]
  autocomplete?: boolean
  minValue?: number
  maxValue?: number
}

export interface AppCommandOptionNumberData {
  type: AppCommandOptionTypes.Number
  name: string
  nameLocalizations?: Record<DiscordLocale, string>
  description: string
  descriptionLocalizations?: Record<DiscordLocale, string>
  required?: boolean
  choices?: AppCommandOptionChoiceData[]
  autocomplete?: boolean
  minValue?: number
  maxValue?: number
}

export interface AppCommandOptionBooleanData {
  type: AppCommandOptionTypes.Boolean
  name: string
  nameLocalizations?: Record<DiscordLocale, string>
  description: string
  descriptionLocalizations?: Record<DiscordLocale, string>
  required?: boolean
}

export interface AppCommandOptionUserData {
  type: AppCommandOptionTypes.User
  name: string
  nameLocalizations?: Record<DiscordLocale, string>
  description: string
  descriptionLocalizations?: Record<DiscordLocale, string>
  required?: boolean
}

export interface AppCommandOptionChannelData {
  type: AppCommandOptionTypes.Channel
  name: string
  nameLocalizations?: Record<DiscordLocale, string>
  description: string
  descriptionLocalizations?: Record<DiscordLocale, string>
  required?: boolean
  channelTypes?: ChannelTypes[]
}

export interface AppCommandOptionRoleData {
  type: AppCommandOptionTypes.Role
  name: string
  nameLocalizations?: Record<DiscordLocale, string>
  description: string
  descriptionLocalizations?: Record<DiscordLocale, string>
  required?: boolean
}

export interface AppCommandOptionMentionableData {
  type: AppCommandOptionTypes.Mentionable
  name: string
  nameLocalizations?: Record<DiscordLocale, string>
  description: string
  descriptionLocalizations?: Record<DiscordLocale, string>
  required?: boolean
}