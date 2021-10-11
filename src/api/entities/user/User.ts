import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { UserData } from '@src/api/entities/user/interfaces'
import { idToDate, idToTimestamp, mergeNewOrSave } from '@src/utils'
import { RawUserData } from '@src/api/entities/user/interfaces/RawUserData'
import { Json } from '@src/api/entities/interfaces/Json'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { UserFlagsUtil } from '@src/api/entities/bitfield'
import { Endpoints } from '@src/constants'

export class User extends AbstractEntity implements UserData {
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

  get createdAt(): Date {
    return idToDate(this.id)
  }

  get createdTimestamp(): number {
    return idToTimestamp(this.id)
  }

  get tag(): string {
    return `${this.username ?? 'unknown'}#${this.discriminator ?? '0000'}`
  }

  get hexAccent(): string | undefined {
    if (!this.accentColor) return void 100500
    return '#' + this.accentColor.toString(16).padStart(6, '0')
  }

  get avatarUrl(): string | undefined {
    return this.avatar ? Endpoints.USER_AVATAR(this.id, this.avatar).join('/') : undefined
  }

  toString(): string {
    return `<@${this.id}>`
  }

  async init(data: UserData | RawUserData): Promise<this> {

    this.id = data.id

    mergeNewOrSave(this, data, [
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
