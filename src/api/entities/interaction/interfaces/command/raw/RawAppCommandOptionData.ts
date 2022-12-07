import { AppCommandOptionTypes, ChannelTypes } from '@src/constants'
import { DiscordLocale } from '@src/constants/common/DiscordLocale'
import { RawAppCommandOptionsChoiceData } from '@src/api/entities/interaction/interfaces/command/raw/RawAppCommandOptionsChoiceData'

export interface RawAppCommandOptionData {
  /** the type of option */
  type: AppCommandOptionTypes
  /** 1-32 character name */
  name: string
  /** localization dictionary for `name` field. values follow the same restrictions as name */
  name_localizations?: Record<DiscordLocale, string>
  /** 1-100 character description */
  description: string
  /** localization dictionary for `description` field. values follow the same restrictions as description */
  description_localizations?: Record<DiscordLocale, string>
  /**
   * if the parameter is required or optional
   * @default false
   * */
  required?: boolean
  /** choices for `STRING`, `INTEGER`, and `NUMBER` types for the user to pick from, max 25 */
  choices?: RawAppCommandOptionsChoiceData[]
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

export interface RawAppCommandOptionStringData {
  type: AppCommandOptionTypes.STRING
  name: string
  name_localizations?: Record<DiscordLocale, string>
  description: string
  description_localizations?: Record<DiscordLocale, string>
  required?: boolean
  choices?: RawAppCommandOptionsChoiceData[]
  autocomplete?: boolean
  max_length?: number
  min_length?: number
}

export interface RawAppCommandOptionIntegerData {
  type: AppCommandOptionTypes.INTEGER
  name: string
  name_localizations?: Record<DiscordLocale, string>
  description: string
  description_localizations?: Record<DiscordLocale, string>
  required?: boolean
  choices?: RawAppCommandOptionsChoiceData[]
  autocomplete?: boolean
  min_value?: number
  max_value?: number
}

export interface RawAppCommandOptionNumberData {
  type: AppCommandOptionTypes.NUMBER
  name: string
  name_localizations?: Record<DiscordLocale, string>
  description: string
  description_localizations?: Record<DiscordLocale, string>
  required?: boolean
  choices?: RawAppCommandOptionsChoiceData[]
  autocomplete?: boolean
  min_value?: number
  max_value?: number
}

export interface RawAppCommandOptionBooleanData {
  type: AppCommandOptionTypes.BOOLEAN
  name: string
  name_localizations?: Record<DiscordLocale, string>
  description: string
  description_localizations?: Record<DiscordLocale, string>
  required?: boolean
}

export interface RawAppCommandOptionUserData {
  type: AppCommandOptionTypes.USER
  name: string
  name_localizations?: Record<DiscordLocale, string>
  description: string
  description_localizations?: Record<DiscordLocale, string>
  required?: boolean
}

export interface RawAppCommandOptionChannelData {
  type: AppCommandOptionTypes.CHANNEL
  name: string
  name_localizations?: Record<DiscordLocale, string>
  description: string
  description_localizations?: Record<DiscordLocale, string>
  required?: boolean
  channel_types?: ChannelTypes[]
}

export interface RawAppCommandOptionRoleData {
  type: AppCommandOptionTypes.ROLE
  name: string
  name_localizations?: Record<DiscordLocale, string>
  description: string
  description_localizations?: Record<DiscordLocale, string>
  required?: boolean
}

export interface RawAppCommandOptionMentionableData {
  type: AppCommandOptionTypes.MENTIONABLE
  name: string
  name_localizations?: Record<DiscordLocale, string>
  description: string
  description_localizations?: Record<DiscordLocale, string>
  required?: boolean
}

export interface RawAppCommandOptionAttachmentData {
  width?: number
  height?: number
  size?: number
  url?: string
  proxy_url?: string
  filename?: string
  id?: string
  content_type?: string
}