import { AppCommandData } from '@src/api/entities/interaction/interfaces/AppCommandData'
import { AppCommandTypes } from '@src/constants'
import { AppCommandOptionData } from '@src/api/entities/interaction/interfaces/AppCommandOptionData'

export interface SlashCommandData extends AppCommandData {
  /** the type of command */
  type: AppCommandTypes.CHAT_INPUT
  /** the parameters for the command, max 25 */
  options?: AppCommandOptionData[]
}