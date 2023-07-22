import { GuildResolvable, InviteChannelData, UserResolvable } from '../../../../../src/api'
import { InviteTargetTypes } from '../../../../../src/constants'

export interface InviteData {
  code: string
  guild?: GuildResolvable
  channel?: InviteChannelData
  channelId?: string
  inviter?: UserResolvable
  targetType?: InviteTargetTypes
  targetUser?: UserResolvable
  targetApplicationId?: any // TODO partial application
  presenceCount?: number
  membersCount?: number
  expiresTimestamp?: string
  guildScheduledEventId?: any // TODO guild scheduled event
  uses?: number
  maxUses?: number
  maxAge?: number
  temporary?: boolean
  createdTimestamp?: string
}
