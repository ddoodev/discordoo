import { RawAppCommandPayloadData } from '@src/api/entities/interaction/interfaces/RawAppCommandPayloadData'

export interface RawUiAppCommandPayloadData extends RawAppCommandPayloadData {
  /** id the of user or message targeted by a user or message command */
  target_id?: string
}