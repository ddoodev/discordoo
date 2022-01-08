import { AppCommandPayloadData } from '@src/api/entities/interaction/interfaces/AppCommandPayloadData'

export interface UiAppCommandPayloadData extends AppCommandPayloadData {
  /** id the of user or message targeted by a user or message command */
  targetId?: string
}