import { RawAppCommandData } from '@src/api/entities/interaction/interfaces/RawAppCommandData'
import { AppCommandTypes } from '@src/constants'
import { RawAppCommandOptionData } from '@src/api/entities/interaction/interfaces/RawAppCommandOptionData'

export interface RawSlashCommandData extends RawAppCommandData {
  /** the type of command */
  type: AppCommandTypes.CHAT_INPUT
  /** the parameters for the command, max 25 */
  options?: RawAppCommandOptionData[]
}