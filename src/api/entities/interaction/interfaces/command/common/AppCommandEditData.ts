import { AppCommandOptionData, BigBitFieldResolvable } from '@src/api'
import { Locale } from '@src/constants/common/Locale'
import { AppCommandTypes } from '@src/constants'

export interface AppCommandEditData {
  /** 1-32 character name */
  name: string
  /** localization dictionary for `name` field. Values follow the same restrictions as name */
  nameLocalizations?: Record<Locale, string>
  /** 1-100 character description for `CHAT_INPUT` commands, empty string for `USER` and `MESSAGE` commands */
  description: string
  /** localization dictionary for `description` field. Values follow the same restrictions as description */
  descriptionLocalizations?: Record<Locale, string>
  /** the type of command, defaults `1` (`CHAT_INPUT`) if not set */
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