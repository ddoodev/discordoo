import { AppCommandEditData } from '@src/api/entities/interaction/interfaces/command/common/AppCommandEditData'
import { Locale } from '@src/constants/common/Locale'
import { AppCommandTypes } from '@src/constants'
import { AppCommandOptionData, BigBitFieldResolvable } from '@src/api'

export class SlashCommandConstructor implements AppCommandEditData {
  /** 1-32 character name */
  declare name: string
  /** localization dictionary for `name` field. Values follow the same restrictions as name */
  public nameLocalizations?: Record<Locale, string>
  /** 1-100 character description for `CHAT_INPUT` commands, empty string for `USER` and `MESSAGE` commands */
  declare description: string
  /** localization dictionary for `description` field. Values follow the same restrictions as description */
  public descriptionLocalizations?: Record<Locale, string>
  /** the type of command, defaults `1` (`CHAT_INPUT`) if not set */
  public type?: AppCommandTypes
  /** parameters for the command, max of 25 */
  public options?: AppCommandOptionData[]
  /** set of permissions represented as a bit set */
  public defaultMemberPermissions?: BigBitFieldResolvable
  /**
   * indicates whether the command is available in DMs with the app, only for globally-scoped commands.
   * by default, commands are visible.
   */
  public dmPermission?: boolean


}
