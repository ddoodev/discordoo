import { AppCommandInteractionPayload } from '@src/api/entities/interaction/interfaces/command/common/AppCommandInteractionPayload'

export interface UiAppCommandPayloadData extends AppCommandInteractionPayload {
  /** id the of user or message targeted by a user or message command */
  targetId?: string
}