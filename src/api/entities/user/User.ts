import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { UserData } from '@src/api/entities/user/interfaces'
import { idToDate, idToTimestamp, ValidationError, mergeNewOrSave } from '@src/utils'
import { RawUserData } from '@src/api/entities/user/interfaces/RawUserData'
import { is } from 'typescript-is'
import { Json } from '@src/api/entities/interfaces/Json'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'

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
  public publicFlags?: number
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

  hexAccent(): string | undefined {
    if (!this.accentColor) return void 100500
    return '#' + this.accentColor.toString(16).padStart(6, '0')
  }

  toString(): string {
    return `<@${this.id}>`
  }

  async init(data: UserData | RawUserData): Promise<this> {
    const isUserData = is<UserData>(data), isRawUserData = is<RawUserData>(data)

    if (!isUserData && !isRawUserData) {
      throw new ValidationError('User', 'Incorrect user data')
    }

    this.id = data.id

    mergeNewOrSave(this, isUserData ? data : User._resolveJson(data), [
      'avatar',
      'username',
      'discriminator',
      'accentColor',
      'banner',
      'email',
      'flags',
      'locale',
      'mfaEnabled',
      'premiumType',
      'publicFlags',
      'verified'
    ])

    this.bot = typeof data.bot === 'boolean' ? data.bot : this.bot ?? false
    this.system = typeof data.system === 'boolean' ? data.system : this.system ?? false

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

  private static _resolveJson(data: RawUserData): UserData {
    const {
      accent_color,
      avatar,
      bot,
      banner,
      discriminator,
      email,
      flags,
      id,
      locale,
      mfa_enabled,
      premium_type,
      public_flags,
      system,
      username,
      verified
    } = data

    return {
      accentColor: accent_color,
      avatar,
      bot,
      banner,
      discriminator,
      email,
      flags,
      id,
      locale,
      mfaEnabled: mfa_enabled,
      premiumType: premium_type,
      publicFlags: public_flags,
      system,
      username,
      verified
    }
  }

}
