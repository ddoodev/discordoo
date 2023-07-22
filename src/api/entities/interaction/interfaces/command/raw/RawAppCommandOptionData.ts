import { AppCommandOptionTypes, ChannelTypes, DiscordLocale } from '../../../../../../../src/constants'
import { ReplaceType } from '../../../../../../../src/utils'
import { RawAppCommandOptionChoiceData } from '../../../../../../../src/api'

export type RawAppCommandOptionData = RawAppCommandStringOptionData
  | RawAppCommandIntegerOptionData
  | RawAppCommandNumberOptionData
  | RawAppCommandBooleanOptionData
  | RawAppCommandUserOptionData
  | RawAppCommandChannelOptionData
  | RawAppCommandRoleOptionData
  | RawAppCommandMentionableOptionData
  | RawAppCommandAttachmentOptionData

export type RawAppCommandOptionWithSubcommandsData = RawAppCommandOptionData
  | RawAppCommandSubcommandOptionData
  | RawAppCommandSubcommandGroupOptionData

export interface RawAppCommandAbstractOptionData {
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
}

export interface RawAppCommandSubcommandOptionData extends Omit<RawAppCommandAbstractOptionData, 'required'> {
  /** the type of option: subcommand */
  type: AppCommandOptionTypes.Subcommand
  /** parameters for the subcommand, max of 25 */
  options?: RawAppCommandOptionData[]
}

export interface RawAppCommandSubcommandGroupOptionData extends Omit<RawAppCommandAbstractOptionData, 'required'> {
  /** the type of option: subcommand group */
  type: AppCommandOptionTypes.SubcommandGroup
  options: RawAppCommandSubcommandOptionData[]
}

export interface RawAppCommandStringOptionData extends RawAppCommandAbstractOptionData {
  /** the type of option */
  type: AppCommandOptionTypes.String
  /** choices for the user to pick from, max 25 */
  choices?: RawAppCommandOptionChoiceData[]
  /**
   * enable autocomplete interactions for this option.
   * autocomplete may not be set to true if choices are present.
   * options using autocomplete are not confined to only use choices given by the application.
   * */
  autocomplete?: boolean
  /** for option type `String`, the minimum allowed length (minimum of 0, maximum of 6000) */
  min_length?: number
  /** for option type `String`, the maximum allowed length (minimum of 1, maximum of 6000) */
  max_length?: number
}

export interface RawAppCommandIntegerOptionData extends ReplaceType<
  Omit<RawAppCommandStringOptionData, 'min_length' | 'max_length'>,
  'type',
  AppCommandOptionTypes.Integer
> {
  /** minimum value user can write */
  min_value?: number
  /** maximum value user can write */
  max_value?: number
}

export type RawAppCommandNumberOptionData = ReplaceType<RawAppCommandIntegerOptionData, 'type', AppCommandOptionTypes.Number>

export interface RawAppCommandBooleanOptionData extends RawAppCommandAbstractOptionData {
  type: AppCommandOptionTypes.Boolean
}

export interface RawAppCommandUserOptionData extends RawAppCommandAbstractOptionData {
  type: AppCommandOptionTypes.User
}

export interface RawAppCommandChannelOptionData extends RawAppCommandAbstractOptionData {
  type: AppCommandOptionTypes.Channel
  channel_types?: ChannelTypes[]
}

export interface RawAppCommandRoleOptionData extends RawAppCommandAbstractOptionData {
  type: AppCommandOptionTypes.Role
}

export interface RawAppCommandMentionableOptionData extends RawAppCommandAbstractOptionData {
  type: AppCommandOptionTypes.Mentionable
}

export interface RawAppCommandAttachmentOptionData extends RawAppCommandAbstractOptionData {
  type: AppCommandOptionTypes.Attachment
}
