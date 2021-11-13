import { AbstractGuildData } from '@src/api/entities/guild/interfaces/AbstractGuildData'
import { GuildNsfwLevels, GuildVerificationLevels } from '@src/constants'

export interface RawViewableGuildData extends AbstractGuildData {
  banner?: string
  splash?: string
  description?: string
  verification_level?: GuildVerificationLevels
  vanity_url_code?: string
  nsfw_level?: GuildNsfwLevels
}