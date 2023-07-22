import { AppCommandTypes, DiscordLocale } from '@src/constants'
import { RawAppCommandOptionWithSubcommandsData } from '@src/api'

export interface RawAppCommandCreateData {
  /** 1-32 character name */
  name: string
  /** localization dictionary for `name` field. Values follow the same restrictions as name */
  name_localizations?: Record<DiscordLocale, string>
  /** 1-100 character description for `ChatInput` commands, empty string for `User` and `MESSAGE` commands */
  description: string
  /** localization dictionary for `description` field. Values follow the same restrictions as description */
  description_localizations?: Record<DiscordLocale, string>
  /** the type of command, defaults `1` (`ChatInput`) if not set */
  type?: AppCommandTypes
  /** parameters for the command, max of 25 */
  options?: RawAppCommandOptionWithSubcommandsData[]
  /** set of permissions represented as a bit set */
  default_member_permissions?: string
  /**
   * indicates whether the command is available in DMs with the app, only for globally-scoped commands.
   * by default, commands are visible.
   */
  dm_permission?: boolean
  /** Indicates whether the command is age-restricted */
  nsfw?: boolean
}
