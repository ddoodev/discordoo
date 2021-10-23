import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { UserData } from '@src/api/entities/user/interfaces'
import { idToDate, idToTimestamp, ImageUrlOptions, attach } from '@src/utils'
import { RawUserData } from '@src/api/entities/user/interfaces/RawUserData'
import { Json } from '@src/api/entities/interfaces/Json'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { UserFlagsUtil } from '@src/api/entities/bitfield'

export class User extends AbstractEntity implements UserData { // TODO: implements WritableChannel
  public accentColor?: number
  public avatar?: string
  public banner?: string
  public bot!: boolean
  public discriminator!: string
  public email?: string
  public flags?: number
  public id!: string
  public locale?: string
  public mfaEnabled?: boolean
  public premiumType?: number
  public publicFlags?: UserFlagsUtil
  public system!: boolean
  public username!: string
  public verified?: boolean

  async init(data: UserData | RawUserData): Promise<this> {

    this.id = data.id ?? this.id

    attach(this, data, [
      'avatar',
      'username',
      'discriminator',
      [ 'accentColor', 'accent_color' ],
      'banner',
      'email',
      'flags',
      'locale',
      [ 'mfaEnabled', 'mfa_enabled' ],
      [ 'premiumType', 'premium_type' ],
      [ 'publicFlags', 'public_flags' ],
      'verified'
    ])

    this.bot = typeof data.bot === 'boolean' ? data.bot : this.bot ?? false
    this.system = typeof data.system === 'boolean' ? data.system : this.system ?? false

    if ('publicFlags' in this) this.publicFlags = new UserFlagsUtil(this.publicFlags)

    return this
  }

  get createdDate(): Date {
    return idToDate(this.id)
  }

  get createdTimestamp(): number {
    return idToTimestamp(this.id)
  }

  get tag(): string {
    return `${this.username ?? 'unknown'}#${this.discriminator ?? '0000'}`
  }

  get hexAccent(): string | undefined {
    if (!this.accentColor) return undefined
    return '#' + this.accentColor.toString(16).padStart(6, '0')
  }

  avatarUrl(options?: ImageUrlOptions): string | undefined {
    return this.avatar ? this.client.internals.rest.cdn().avatar(this.id, this.avatar, options) : undefined
  }

  defaultAvatarUrl(): string {
    return this.client.internals.rest.cdn().defaultAvatar(this.discriminator)
  }

  displayAvatarUrl(options?: ImageUrlOptions): string {
    return this.avatarUrl(options) ?? this.defaultAvatarUrl()
  }

  bannerUrl(options?: ImageUrlOptions): string | undefined {
    return this.banner ? this.client.internals.rest.cdn().banner(this.id, this.banner, options) : undefined
  }

  toString(): string {
    return `<@${this.id}>`
  }

  toJson(properties?: ToJsonProperties): Json {
    return super.toJson({
      ...properties,
      accentColor: true,
      avatar: true,
      banner: true,
      bot: true,
      discriminator: true,
      email: true,
      flags: true,
      id: true,
      locale: true,
      mfaEnabled: true,
      premiumType: true,
      publicFlags: true,
      system: true,
      username: true,
      verified: true
    })
  }

}
