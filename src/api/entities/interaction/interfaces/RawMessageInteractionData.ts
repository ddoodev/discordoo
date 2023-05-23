import { InteractionTypes } from '@src/constants'
import { RawGuildMemberData, RawUserData } from '@src/api'

export interface RawMessageInteractionData {
  id: string
  type: InteractionTypes
  name: string
  user: RawUserData
  member?: RawGuildMemberData
}
