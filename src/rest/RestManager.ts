import { Client, ProviderConstructor } from '@src/core'
import { RestRequest, RestManagerData, RestManagerRequestData, RestLimitsManager, makeRequest } from '@src/rest'
import { RestProvider, RestRequestOptions, RestFinishedResponse } from '@discordoo/providers'
import { ImageUrlOptions, makeImageUrl } from '@src/utils'
import { StickerFormatTypes } from '@src/constants'
import { CompletedRestOptions } from '@src/rest/interfaces/CompletedRestOptions'

export class RestManager<P extends RestProvider = RestProvider> {
  public client: Client
  public provider: P
  public limiter: RestLimitsManager
  public options: CompletedRestOptions

  constructor(client: Client, Provider: ProviderConstructor<P>, data: RestManagerData) {
    this.client = client
    this.provider = new Provider(this.client, data.restOptions, data.providerOptions)
    this.limiter = new RestLimitsManager(this.client)
    this.options = data.restOptions
  }

  api(): RestRequest {
    return makeRequest(this)
  }

  cdn(cdn = 'https://cdn.discordapp.com') {
    const { defaultImageFormat } = this.options

    return {
      asset: (name: string) => {
        return `${cdn}/assets/${name}`
      },
      appIcon: (appId: string, hash: string, options: ImageUrlOptions = {}) => {
        return makeImageUrl(`${cdn}/app-icons/${appId}/${hash}`, defaultImageFormat, options)
      },
      appAsset: (appId: string, hash: string, options: ImageUrlOptions = {}) => {
        return makeImageUrl(`${cdn}/app-assets/${appId}/${hash}`, defaultImageFormat, options)
      },
      avatar: (userId: string, hash: string, options: ImageUrlOptions = {}) => {
        return makeImageUrl(`${cdn}/avatars/${userId}/${hash}`, defaultImageFormat, {
          format: options.dynamic && hash.startsWith('a_') ? 'gif' : options.format,
          size: options.size
        })
      },
      banner: (bannerId: string, hash: string, options: ImageUrlOptions = {}) => {
        return makeImageUrl(`${cdn}/banners/${bannerId}/${hash}`, defaultImageFormat, {
          format: options.dynamic && hash.startsWith('a_') ? 'gif' : options.format,
          size: options.size
        })
      },
      channelIcon: (channelId: string, hash: string, options: ImageUrlOptions = {}) => {
        return makeImageUrl(`${cdn}/channel-icons/${channelId}/${hash}`, defaultImageFormat, options)
      },
      defaultAvatar: (discriminator: string) => {
        return `${cdn}/embed/avatars/${Number(discriminator) % 5}.png`
      },
      discoverySplash: (guildId: string, hash: string, options: ImageUrlOptions = {}) => {
        return makeImageUrl(`${cdn}/discovery-splashes/${guildId}/${hash}`, defaultImageFormat, options)
      },
      guildMemberAvatar: (guildId: string, userId: string, hash: string, options: ImageUrlOptions = {}) => {
        return makeImageUrl(`${cdn}/guilds/${guildId}/users/${userId}/avatars/${hash}`, defaultImageFormat, {
          format: options.dynamic && hash.startsWith('a_') ? 'gif' : options.format,
          size: options.size
        })
      },
      icon: (guildId: string, hash: string, options: ImageUrlOptions = {}) => {
        return makeImageUrl(`${cdn}/icons/${guildId}/${hash}`, defaultImageFormat, {
          format: options.dynamic && hash.startsWith('a_') ? 'gif' : options.format,
          size: options.size
        })
      },
      stickerPackBanner: (bannerId: string, options: ImageUrlOptions = {}) => {
        return makeImageUrl(`${cdn}/app-assets/710982414301790216/store/${bannerId}`, defaultImageFormat, options)
      },
      splash: (guildId: string, hash: string, options: ImageUrlOptions = {}) => {
        return makeImageUrl(`${cdn}/splashes/${guildId}/${hash}`, defaultImageFormat, options)
      },
      teamIcon: (teamId: string, hash: string, options: ImageUrlOptions = {}) => {
        return makeImageUrl(`${cdn}/team-icons/${teamId}/${hash}`, defaultImageFormat, options)
      },
      sticker: (stickerId: string, stickerFormat: StickerFormatTypes) => {
        return `${cdn}/stickers/${stickerId}.${stickerFormat === StickerFormatTypes.LOTTIE ? 'json' : 'png'}`
      },
      roleIcon: (roleId: string, hash: string, options: ImageUrlOptions = {}) => {
        return makeImageUrl(`${cdn}/role-icons/${roleId}/${hash}`, defaultImageFormat, options)
      },
      emoji: (emojiId: string, options: ImageUrlOptions = {}) => {
        return `${cdn}/emojis/${emojiId}.${options.format ?? defaultImageFormat}`
      },
    }
  }

  async request<T = any>(data: RestManagerRequestData, options: RestRequestOptions = {}): RestFinishedResponse<T> {

    if (!this.client.options.rest?.rateLimits?.disable) {
      // TODO: rate limits
    }

    const response = await this.provider.request<T>({
      method: data.method,
      path: data.path,
      attachments: data.attachments ?? [],
      headers: data.headers,
      body: data.body,
    }, options)

    // TODO: this.limiter.passHeaders or something

    return response
  }

  async init(): Promise<void> {
    await this.limiter.init()
    await this.provider.init()
  }

}
