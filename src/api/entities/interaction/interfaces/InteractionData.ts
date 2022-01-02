import { InteractionTypes } from '@src/constants'
import { ChannelResolvable, GuildResolvable, MessageResolvable, UserResolvable } from '@src/api'
import { GuildMemberResolvable } from '@src/api/entities/member/interfaces/GuildMemberResolvable'

export interface InteractionData {
  id: string
  applicationId: string
  type: InteractionTypes
  guild?: GuildResolvable
  channel?: ChannelResolvable
  member?: GuildMemberResolvable
  user?: UserResolvable
  token: string
  version: number
  message?: MessageResolvable
}