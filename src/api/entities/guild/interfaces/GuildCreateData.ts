import { BufferResolvable } from '@src/utils'
import { GuildChannelCreateData, RoleCreateData } from '@src/api'
import { GuildDefaultMessageNotificationLevel, GuildExplicitContentFilterLevels, GuildVerificationLevels } from '@src/constants'

export interface GuildCreateData {
  name: string
  region?: string
  icon?: BufferResolvable
  verificationLevel?: GuildVerificationLevels
  defaultNotifications?: GuildDefaultMessageNotificationLevel
  explicitContentFilter?: GuildExplicitContentFilterLevels
  roles?: RoleCreateData[]
  channels?: GuildChannelCreateData[]
  afkChannelId?: string
  afkTimeout?: number
  systemChannelId?: string
}