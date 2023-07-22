import { AppCommandInteractionPayload } from '@src/api'

export interface UiAppCommandInteractionData extends AppCommandInteractionPayload {
  /** id the of user or message targeted by a user or message command */
  targetId: string
}
