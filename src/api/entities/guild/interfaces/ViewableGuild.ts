import { ImageUrlOptions } from '@src/utils'
import { GuildNsfwLevels, GuildVerificationLevels } from '@src/constants'

export interface ViewableGuild {
  splash?: string
  banner?: string
  description?: string
  verificationLevel: GuildVerificationLevels
  vanityUrlCode?: string
  nsfwLevel: GuildNsfwLevels

  bannerUrl(options?: ImageUrlOptions): string | undefined

  splashUrl(options?: ImageUrlOptions): string | undefined

}