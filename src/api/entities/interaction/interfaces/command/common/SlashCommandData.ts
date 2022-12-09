import { AppCommandData } from '@src/api/entities/interaction/interfaces/command/common/AppCommandData'
import { AppCommandTypes } from '@src/constants'
import { AppCommandOptionData } from '@src/api/entities/interaction/interfaces/command/common/AppCommandOptionData'

export interface SlashCommandData extends AppCommandData {
  /** the type of command */
  type: AppCommandTypes.ChatInput
  /** the parameters for the command, max 25 */
  options?: AppCommandOptionData[]
}