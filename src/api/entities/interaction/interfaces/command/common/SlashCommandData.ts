import { AppCommandTypes } from '@src/constants'
import { AppCommandData, AppCommandOptionData } from '@src/api'

export interface SlashCommandData extends AppCommandData {
  /** the type of command */
  type: AppCommandTypes.ChatInput
  /** the parameters for the command, max 25 */
  options?: AppCommandOptionData[]
}
