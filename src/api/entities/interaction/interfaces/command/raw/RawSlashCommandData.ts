import { RawAppCommandData } from '@src/api/entities/interaction/interfaces/command/raw/RawAppCommandData'
import { AppCommandTypes } from '@src/constants'
import { RawAppCommandOptionData } from '@src/api/entities/interaction/interfaces/command/raw/RawAppCommandOptionData'

export interface RawSlashCommandData extends RawAppCommandData {
  /** the type of command */
  type: AppCommandTypes.ChatInput
  /** the parameters for the command, max 25 */
  options?: RawAppCommandOptionData[]
}