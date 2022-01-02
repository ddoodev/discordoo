import { InteractionTypes } from '@src/constants'
import { RawGuildMemberData, RawMessageData, RawUserData } from '@src/api'

export interface RawInteractionData {
  id: string
  application_id: string
  type: InteractionTypes
  guild_id?: string
  channel_id?: string
  member?: RawGuildMemberData
  user?: RawUserData
  token: string
  version: number
  message?: RawMessageData
}