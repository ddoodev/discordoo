import { Json, ToJsonProperties } from '@src/api'
import { PresenceActivityAssetsData } from '@src/api/entities/presence/interfaces/PresenceActivityAssetsData'
import { RawPresenceActivityAssetsData } from '@src/api/entities/presence/interfaces/RawPresenceActivityAssetsData'
import { attach, ImageUrlOptions } from '@src/utils'
import { SPOTIFY_CDN_IMAGES, TWITCH_CDN_LIVE_USERS_IMAGES, YOUTUBE_CDN } from '@src/constants'
import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class PresenceActivityAssets extends AbstractEntity implements PresenceActivityAssetsData {
  public largeImage?: string
  public largeText?: string
  public smallImage?: string
  public smallText?: string
  public applicationId?: string

  async init(data: PresenceActivityAssetsData | RawPresenceActivityAssetsData, options?: EntityInitOptions): Promise<this> {
    attach(this, data, {
      props: [
        [ 'largeImage', 'large_image' ],
        [ 'largeText', 'large_text' ],
        [ 'smallImage', 'small_image' ],
        [ 'smallText', 'small_text' ],
        [ 'applicationId', 'application_id' ],
      ],
      disabled: options?.ignore
    })

    return this
  }

  largeImageUrl(options?: ImageUrlOptions): string | undefined {
    if (!this.largeImage) return undefined

    if (this.largeImage.includes(':')) {
      const [ platform, image ] = this.largeImage.split(':')

      switch (platform) {
        case 'spotify':
          return SPOTIFY_CDN_IMAGES + `/${image}`
        case 'twitch':
          return TWITCH_CDN_LIVE_USERS_IMAGES + `${image}.png`
        case 'youtube':
          return YOUTUBE_CDN + `/${image}/hqdefault_live.jpg`
        case 'mp':
          return `https://media.discordapp.net/${image}` // TODO: add media/cdn to ClientOptions
        default:
          return undefined
      }
    }

    if (!this.applicationId) return undefined

    return this.client.internals.rest.cdn.appAsset(this.applicationId, this.largeImage, options)
  }

  smallImageUrl(options?: ImageUrlOptions): string | undefined {
    if (!this.smallImage) return undefined

    if (this.smallImage.startsWith('mp:')) {
      return `https://media.discordapp.net/${this.smallImage.slice(3)}` // TODO: add media/cdn to ClientOptions
    }

    if (!this.applicationId) return undefined

    return this.client.internals.rest.cdn.appAsset(this.applicationId, this.smallImage, options)
  }

  toJson(properties: ToJsonProperties, obj?: any): Json {
    return super.toJson({
      ...properties,
      largeImage: true,
      largeText: true,
      smallImage: true,
      smallText: true,
      applicationId: true,
    }, obj)
  }

}
