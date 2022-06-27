import { RawAppCommandInteractionData } from '@src/api/entities/interaction/interfaces/command/raw/RawAppCommandInteractionData'

export interface RawUiAppCommandInteractionData extends RawAppCommandInteractionData {
  /** id the of user or message targeted by a user or message command */
  target_id?: string
}