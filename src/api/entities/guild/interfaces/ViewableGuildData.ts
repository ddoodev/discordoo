import { AbstractGuildData } from '@src/api/entities/guild/interfaces/AbstractGuildData'
import { GuildNsfwLevels, GuildVerificationLevels } from '@src/constants'

export interface ViewableGuildData extends AbstractGuildData {
  banner?: string
  splash?: string
  description?: string
  verificationLevel?: GuildVerificationLevels
  vanityUrlCode?: string
  nsfwLevel?: GuildNsfwLevels
}