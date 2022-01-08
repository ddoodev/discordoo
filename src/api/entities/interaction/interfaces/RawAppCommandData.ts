import { AppCommandTypes } from '@src/constants'

export interface RawAppCommandData {
  /** unique id of the command */
  id: string
  /** 1-32 character name */
  name: string
  /** 1-100 character description for `CHAT_INPUT` commands, empty string for `USER` and `MESSAGE` commands */
  description: string
  /** autoincrementing version identifier updated during substantial record changes */
  version: string
  /** unique id of the parent application */
  application_id: string
  /** the type of command, defaults `1` (`CHAT_INPUT`) if not set */
  type?: AppCommandTypes
  /** guild id of the command, if not global */
  guild_id?: string
  /** whether the command is enabled by default when the app is added to a guild */
  default_permission?: boolean
}