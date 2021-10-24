import { Json, ToJsonProperties } from '@src/api'
import { PresenceActivityAssetsData } from '@src/api/entities/presence/interfaces/PresenceActivityAssetsData'
import { RawPresenceActivityAssetsData } from '@src/api/entities/presence/interfaces/RawPresenceActivityAssetsData'
import { attach, ImageUrlOptions } from '@src/utils'
import { SPOTIFY_CDN_IMAGES, TWITCH_CDN_LIVE_USERS_IMAGES } from '@src/constants'
import { AbstractEntity } from '@src/api/entities/AbstractEntity'

export class PresenceActivityAssets extends AbstractEntity implements PresenceActivityAssetsData {
  public largeImage?: string
  public largeText?: string
  public smallImage?: string
  public smallText?: string
  public applicationId?: string

  async init(data: PresenceActivityAssetsData | RawPresenceActivityAssetsData): Promise<this> {
    attach(this, data, [
      [ 'largeImage', 'large_image' ],
      [ 'largeText', 'large_text' ],
      [ 'smallImage', 'small_image' ],
      [ 'smallText', 'small_text' ],
      [ 'applicationId', 'application_id' ],
    ])

    return this
  }

  largeImageUrl(options?: ImageUrlOptions): string | undefined {
    if (!this.largeImage || !this.applicationId) return undefined

    if (this.largeImage.startsWith('spotify:')) {
      return SPOTIFY_CDN_IMAGES + `/${this.largeImage.slice(8)}`
    }

    if (this.largeImage.startsWith('twitch:')) {
      return TWITCH_CDN_LIVE_USERS_IMAGES + `${this.largeImage.slice(7)}.png`
    }

    return this.client.internals.rest.cdn().appAsset(this.applicationId, this.largeImage, options)
  }

  smallImageUrl(options?: ImageUrlOptions): string | undefined {
    if (!this.smallImage || !this.applicationId) return undefined

    return this.client.internals.rest.cdn().appAsset(this.applicationId, this.smallImage, options)
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
