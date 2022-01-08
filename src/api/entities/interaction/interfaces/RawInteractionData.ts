import { InteractionTypes } from '@src/constants'
import { RawGuildMemberData, RawMessageData, RawUserData } from '@src/api'

export interface RawInteractionData {
  /** id of the interaction */
  id: string
  /** id of the application this interaction is for */
  application_id: string
  /** the type of interaction */
  type: InteractionTypes
  /** the guild it was sent from */
  guild_id?: string
  /** the channel it was sent from */
  channel_id?: string
  /** guild member data for the invoking user */
  member?: RawGuildMemberData
  /**	user object for the invoking user, if invoked in a DM */
  user?: RawUserData
  /** a continuation token for responding to the interaction */
  token: string
  /** for components, the message they were attached to */
  message?: RawMessageData
  version: number
}