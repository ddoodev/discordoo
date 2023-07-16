import { RawAppCommandInteractionData } from '@src/api'

export interface RawUiAppCommandInteractionData extends RawAppCommandInteractionData {
  /** id the of user or message targeted by a user or message command */
  target_id: string
}
