import { RawUserData } from '@src/api'
import { InviteTargetTypes } from '@src/constants'

export interface RawInviteCreateEventData {
  channel_id: string
  code: string
  created_at: string
  guild_id?: string
  inviter?: RawUserData
  max_age: number
  max_uses: number
  target_type?: InviteTargetTypes
  target_user?: RawUserData
  temporary: boolean
  uses: number
}