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

export interface AppCommandOptionStringData {
  type: AppCommandOptionTypes.STRING
  name: string
  nameLocalizations?: Record<DiscordLocale, string>
  description: string
  descriptionLocalizations?: Record<DiscordLocale, string>
  required?: boolean
  choices?: AppCommandOptionChoiceData[]
  autocomplete?: boolean
  maxLength?: number
  minLength?: number
}

export interface AppCommandOptionIntegerData {
  type: AppCommandOptionTypes.INTEGER
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
  type: AppCommandOptionTypes.NUMBER
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
  type: AppCommandOptionTypes.BOOLEAN
  name: string
  nameLocalizations?: Record<DiscordLocale, string>
  description: string
  descriptionLocalizations?: Record<DiscordLocale, string>
  required?: boolean
}

export interface AppCommandOptionUserData {
  type: AppCommandOptionTypes.USER
  name: string
  nameLocalizations?: Record<DiscordLocale, string>
  description: string
  descriptionLocalizations?: Record<DiscordLocale, string>
  required?: boolean
}

export interface AppCommandOptionChannelData {
  type: AppCommandOptionTypes.CHANNEL
  name: string
  nameLocalizations?: Record<DiscordLocale, string>
  description: string
  descriptionLocalizations?: Record<DiscordLocale, string>
  required?: boolean
  channelTypes?: ChannelTypes[]
}

export interface AppCommandOptionRoleData {
  type: AppCommandOptionTypes.ROLE
  name: string
  nameLocalizations?: Record<DiscordLocale, string>
  description: string
  descriptionLocalizations?: Record<DiscordLocale, string>
  required?: boolean
}

export interface AppCommandOptionMentionableData {
  type: AppCommandOptionTypes.MENTIONABLE
  name: string
  nameLocalizations?: Record<DiscordLocale, string>
  description: string
  descriptionLocalizations?: Record<DiscordLocale, string>
  required?: boolean
}