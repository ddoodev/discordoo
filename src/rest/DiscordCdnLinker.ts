import { AllowedImageFormats, AllowedImageSizes, ImageUrlOptions, makeImageUrl } from '@src/utils'
import { StickerFormatTypes } from '@src/constants'

export class DiscordCdnLinker {
  constructor(
    public readonly cdn: string,
    public readonly imageFormat: AllowedImageFormats,
    public readonly imageSize: AllowedImageSizes
  ) {
  }

  asset(name: string) {
    return `${this.cdn}/assets/${name}`
  }

  appIcon(appId: string, hash: string, options: ImageUrlOptions = { size: this.imageSize }) {
    return makeImageUrl(`${this.cdn}/app-icons/${appId}/${hash}`, this.imageFormat, options)
  }

  appAsset(appId: string, hash: string, options: ImageUrlOptions = { size: this.imageSize }) {
    return makeImageUrl(`${this.cdn}/app-assets/${appId}/${hash}`, this.imageFormat, options)
  }

  avatar(userId: string, hash: string, options: ImageUrlOptions = { size: this.imageSize }) {
    return makeImageUrl(`${this.cdn}/avatars/${userId}/${hash}`, this.imageFormat, {
      format: options.dynamic && hash.startsWith('a_') ? 'gif' : options.format,
      size: options.size
    })
  }

  banner(bannerId: string, hash: string, options: ImageUrlOptions = { size: this.imageSize }) {
    return makeImageUrl(`${this.cdn}/banners/${bannerId}/${hash}`, this.imageFormat, {
      format: options.dynamic && hash.startsWith('a_') ? 'gif' : options.format,
      size: options.size
    })
  }

  channelIcon(channelId: string, hash: string, options: ImageUrlOptions = { size: this.imageSize }) {
    return makeImageUrl(`${this.cdn}/channel-icons/${channelId}/${hash}`, this.imageFormat, options)
  }

  defaultAvatar(discriminator: string) {
    return `${this.cdn}/embed/avatars/${Number(discriminator) % 5}.png`
  }

  discoverySplash(guildId: string, hash: string, options: ImageUrlOptions = { size: this.imageSize }) {
    return makeImageUrl(`${this.cdn}/discovery-splashes/${guildId}/${hash}`, this.imageFormat, options)
  }

  guildMemberAvatar(guildId: string, userId: string, hash: string, options: ImageUrlOptions = { size: this.imageSize }) {
    return makeImageUrl(`${this.cdn}/guilds/${guildId}/users/${userId}/avatars/${hash}`, this.imageFormat, {
      format: options.dynamic && hash.startsWith('a_') ? 'gif' : options.format,
      size: options.size
    })
  }

  icon(guildId: string, hash: string, options: ImageUrlOptions = { size: this.imageSize }) {
    return makeImageUrl(`${this.cdn}/icons/${guildId}/${hash}`, this.imageFormat, {
      format: options.dynamic && hash.startsWith('a_') ? 'gif' : options.format,
      size: options.size
    })
  }

  stickerPackBanner(bannerId: string, options: ImageUrlOptions = { size: this.imageSize }) {
    return makeImageUrl(`${this.cdn}/app-assets/710982414301790216/store/${bannerId}`, this.imageFormat, options)
  }

  splash(guildId: string, hash: string, options: ImageUrlOptions = { size: this.imageSize }) {
    return makeImageUrl(`${this.cdn}/splashes/${guildId}/${hash}`, this.imageFormat, options)
  }

  teamIcon(teamId: string, hash: string, options: ImageUrlOptions = { size: this.imageSize }) {
    return makeImageUrl(`${this.cdn}/team-icons/${teamId}/${hash}`, this.imageFormat, options)
  }

  sticker(stickerId: string, stickerFormat: StickerFormatTypes) {
    return `${this.cdn}/stickers/${stickerId}.${stickerFormat === StickerFormatTypes.LOTTIE ? 'json' : 'png'}`
  }

  roleIcon(roleId: string, hash: string, options: ImageUrlOptions = { size: this.imageSize }) {
    return makeImageUrl(`${this.cdn}/role-icons/${roleId}/${hash}`, this.imageFormat, options)
  }

  emoji(emojiId: string, options: ImageUrlOptions = { size: this.imageSize }) {
    return `${this.cdn}/emojis/${emojiId}.${options.format ?? this.imageFormat}`
  }
}