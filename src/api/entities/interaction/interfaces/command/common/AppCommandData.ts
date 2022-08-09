import { AppCommandTypes } from '@src/constants'
import { AppCommandOptionData, BigBitFieldResolvable, GuildResolvable } from '@src/api'
import { DiscordLocale } from '@src/constants/common/DiscordLocale'

export interface AppCommandData {
  /** unique id of the command */
  id: string
  /** 1-32 character name */
  name: string
  /** localization dictionary for `name` field. Values follow the same restrictions as name */
  nameLocalizations?: Record<DiscordLocale, string>
  /** 1-100 character description for `CHAT_INPUT` commands, empty string for `USER` and `MESSAGE` commands */
  description: string
  /** localization dictionary for `description` field. Values follow the same restrictions as description */
  descriptionLocalizations?: Record<DiscordLocale, string>
  /** autoincrement version identifier updated during substantial record changes */
  version: string
  /** unique id of the parent application */
  applicationId: string
  /** the type of command, defaults `1` (`CHAT_INPUT`) if not set */
  type?: AppCommandTypes
  /** guild of the command, if not global */
  guild?: GuildResolvable
  /** parameters for the command, max of 25 */
  options?: AppCommandOptionData[]
  /** set of permissions represented as a bit set */
  defaultMemberPermissions?: BigBitFieldResolvable
  /**
   * indicates whether the command is available in DMs with the app, only for globally-scoped commands.
   * by default, commands are visible.
   * */
  dmPermission?: boolean
}