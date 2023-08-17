import { RawGuildChannelCreateData, RawRoleCreateData } from '@src/api'
import { GuildDefaultMessageNotificationLevel, GuildExplicitContentFilterLevels, GuildVerificationLevels } from '@src/constants'

export interface RawGuildCreateData {
  name: string
  region?: string
  icon?: Buffer | ArrayBuffer
  verification_level?: GuildVerificationLevels
  default_notifications?: GuildDefaultMessageNotificationLevel
  explicit_content_filter?: GuildExplicitContentFilterLevels
  roles?: RawRoleCreateData[]
  channels?: RawGuildChannelCreateData[]
  afk_channel_id?: string
  afk_timeout?: number
  system_channel_id?: string
}