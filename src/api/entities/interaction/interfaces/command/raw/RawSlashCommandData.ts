import { RawAppCommandData, RawAppCommandOptionData } from '@src/api'
import { AppCommandTypes } from '@src/constants'

export interface RawSlashCommandData extends RawAppCommandData {
  /** the type of command */
  type: AppCommandTypes.ChatInput
  /** the parameters for the command, max 25 */
  options?: RawAppCommandOptionData[]
}
