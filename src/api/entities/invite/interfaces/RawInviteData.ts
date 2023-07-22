import { RawUserData, RawViewableGuildData, InviteChannelData } from '../../../../../src/api'
import { InviteTargetTypes } from '../../../../../src/constants'

export interface RawInviteData {
  code: string
  guild?: RawViewableGuildData
  channel?: InviteChannelData
  inviter?: RawUserData
  target_type?: InviteTargetTypes
  target_user?: RawUserData
  target_application?: any // TODO partial application
  approximate_presence_count?: number
  approximate_member_count?: number
  expires_at?: string
  guild_scheduled_event?: any // TODO guild scheduled event
  uses?: number
  max_uses?: number
  max_age?: number
  temporary?: boolean
  created_at?: string
}
