import { InteractionTypes } from '@src/constants'
import { GuildMemberResolvable, UserResolvable } from '@src/api'

export interface MessageInteractionData {
  id: string
  type: InteractionTypes
  name: string
  user: UserResolvable
  member?: GuildMemberResolvable
}
