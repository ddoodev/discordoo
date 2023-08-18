import {
  DiscordLocale,
  GuildDefaultMessageNotificationLevel,
  GuildExplicitContentFilterLevels,
  GuildFeatures,
  GuildVerificationLevels
} from '@src/constants'

export interface RawGuildEditData {
  name?: string
  region?: string
  icon?: Buffer | ArrayBuffer
  verification_level?: GuildVerificationLevels
  default_notifications?: GuildDefaultMessageNotificationLevel
  explicit_content_filter?: GuildExplicitContentFilterLevels
  afk_channel_id?: string
  afk_timeout?: number
  system_channel_id?: string
  system_channel_flags?: number
  rules_channel_id?: string
  public_updates_channel_id?: string
  preferred_locale?: DiscordLocale
  features?: GuildFeatures[]
  description?: string
  banner?: Buffer | ArrayBuffer
  splash?: Buffer | ArrayBuffer
  discovery_splash?: Buffer | ArrayBuffer
  owner_id?: string
  widget_enabled?: boolean
  widget_channel_id?: string
  premium_progress_enabled?: boolean
  safety_alerts_channel_id?: string
}
