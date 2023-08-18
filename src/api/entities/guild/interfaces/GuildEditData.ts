import { BufferResolvable } from '@src/utils'
import {
  DiscordLocale,
  GuildDefaultMessageNotificationLevel,
  GuildExplicitContentFilterLevels, GuildFeatures,
  GuildVerificationLevels
} from '@src/constants'

export interface GuildEditData {
  name?: string
  region?: string
  icon?: BufferResolvable
  verificationLevel?: GuildVerificationLevels
  defaultNotifications?: GuildDefaultMessageNotificationLevel
  explicitContentFilter?: GuildExplicitContentFilterLevels
  afkChannelId?: string
  afkTimeout?: number
  systemChannelId?: string
  systemChannelFlags?: number
  rulesChannelId?: string
  publicUpdatesChannelId?: string
  preferredLocale?: DiscordLocale
  features?: GuildFeatures[]
  description?: string
  banner?: BufferResolvable
  splash?: BufferResolvable
  discoverySplash?: BufferResolvable
  ownerId?: string
  widgetEnabled?: boolean
  widgetChannelId?: string
  premiumProgressEnabled?: boolean
  safetyAlertsChannelId?: string
}