import { AbstractGuild } from '@src/api/entities/guild/AbstractGuild'
import { ViewableGuild } from '@src/api/entities/guild/interfaces/ViewableGuild'
import { attach, ImageUrlOptions } from '@src/utils'
import { GuildNsfwLevels, GuildVerificationLevels } from '@src/constants'
import { ViewableGuildData } from '@src/api/entities/guild/interfaces/ViewableGuildData'
import { RawViewableGuildData } from '@src/api/entities/guild/interfaces/RawViewableGuildData'

export abstract class AbstractViewableGuild extends AbstractGuild implements ViewableGuild {
  public banner?: string
  public description?: string
  public declare nsfwLevel: GuildNsfwLevels
  public splash?: string
  public vanityUrlCode?: string
  public declare verificationLevel: GuildVerificationLevels

  async init(data: ViewableGuildData | RawViewableGuildData): Promise<this> {
    await super.init(data)

    attach(this, data, {
      props: [
        'banner',
        'description',
        [ 'nsfwLevel', 'nsfw_level', GuildNsfwLevels.DEFAULT ],
        'splash',
        [ 'vanityUrlCode', 'vanity_url_code' ],
        [ 'verificationLevel', 'verification_level', GuildVerificationLevels.NONE ]
      ]
    })

    return this
  }

  bannerUrl(options?: ImageUrlOptions): string | undefined {
    return this.banner ? this.client.internals.rest.cdn.banner(this.id, this.banner, options) : undefined
  }

  splashUrl(options?: ImageUrlOptions): string | undefined {
    return this.splash ? this.client.internals.rest.cdn.splash(this.id, this.splash, options) : undefined
  }

}