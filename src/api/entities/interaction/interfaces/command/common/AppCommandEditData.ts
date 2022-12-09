import { AppCommandOptionData, BigBitFieldResolvable } from '@src/api'
import { DiscordLocale } from '@src/constants/common/DiscordLocale'
import { AppCommandTypes } from '@src/constants'

export interface AppCommandEditData {
  /** 1-32 character name */
  name: string
  /** localization dictionary for `name` field. Values follow the same restrictions as name */
  nameLocalizations?: Record<DiscordLocale, string>
  /** 1-100 character description for `ChatInput` commands, empty string for `User` and `MESSAGE` commands */
  description: string
  /** localization dictionary for `description` field. Values follow the same restrictions as description */
  descriptionLocalizations?: Record<DiscordLocale, string>
  /** the type of command, defaults `1` (`ChatInput`) if not set */
  type?: AppCommandTypes
  /** parameters for the command, max of 25 */
  options?: AppCommandOptionData[]
  /** set of permissions represented as a bit set */
  defaultMemberPermissions?: BigBitFieldResolvable
  /**
   * indicates whether the command is available in DMs with the app, only for globally-scoped commands.
   * by default, commands are visible.
   */
  dmPermission?: boolean
}