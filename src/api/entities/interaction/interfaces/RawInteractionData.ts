import { InteractionTypes } from '@src/constants'
import { AbstractChannelData, RawGuildMemberData, RawMessageData, RawUserData } from '@src/api'

export interface RawInteractionData<RawDataType = any> {
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
  /** the channel it was sent from */
  channel?: AbstractChannelData
  /** guild member data for the invoking user */
  member?: RawGuildMemberData
  /**	user object for the invoking user, if invoked in a Dm */
  user?: RawUserData
  /** a continuation token for responding to the interaction */
  token: string
  /** for components, the message they were attached to */
  message?: RawMessageData
  version: number
  /** the selected language of the invoking user */
  locale?: string
  /** bitwise set of permissions the app or bot has within the channel the interaction was sent from */
  app_permissions?: string
  /** the guild's preferred locale, if invoked in a guild */
  guild_locale?: string
  /** the data for the interaction */
  data: RawDataType extends any ? any | undefined : RawDataType
}
