import { BufferResolvable } from '@src/utils'
import { GuildDefaultMessageNotificationLevel, GuildExplicitContentFilterLevels, GuildVerificationLevels } from '@src/constants'

export interface GuildEditData {
  name: string
  region?: string
  icon?: BufferResolvable
  verificationLevel?: GuildVerificationLevels
  defaultNotifications?: GuildDefaultMessageNotificationLevel
  explicitContentFilter?: GuildExplicitContentFilterLevels
  afkChannelId?: string
  afkTimeout?: number
  systemChannelId?: string
}