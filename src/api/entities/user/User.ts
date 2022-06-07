import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { UserData } from '@src/api/entities/user/interfaces'
import { idToDate, idToTimestamp, ImageUrlOptions, attach, resolveGuildId, DiscordooError } from '@src/utils'
import { RawUserData } from '@src/api/entities/user/interfaces/RawUserData'
import { Json } from '@src/api/entities/interfaces/Json'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { UserFlagsUtil } from '@src/api/entities/bitfield'
import { GuildResolvable, Presence } from '@src/api'
import { CacheManagerFilterOptions, CacheManagerGetOptions } from '@src/cache'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class User extends AbstractEntity implements UserData { // TODO: implements WritableChannel
  public accentColor?: number
  public avatar?: string
  public banner?: string
  public declare bot: boolean
  public declare discriminator: string
  public email?: string
  public declare id: string
  public locale?: string
  public mfaEnabled?: boolean
  public premiumType?: number
  public flags?: UserFlagsUtil
  public declare system: boolean
  public declare username: string
  public verified?: boolean

  async init(data: UserData | RawUserData, options?: EntityInitOptions): Promise<this> {

    this.id = data.id ?? this.id

    attach(this, data, {
      props: [
        'avatar',
        'username',
        [ 'discriminator', undefined, '0000' ],
        [ 'accentColor', 'accent_color' ],
        'banner',
        'email',
        'locale',
        [ 'mfaEnabled', 'mfa_enabled' ],
        [ 'premiumType', 'premium_type' ],
        [ 'flags', 'public_flags' ],
        'verified'
      ],
      disabled: options?.ignore,
      enabled: [ 'discriminator' ]
    })

    this.bot = typeof data.bot === 'boolean' ? data.bot : this.discriminator === '0000' ? true : this.bot ?? false
    this.system = typeof data.system === 'boolean' ? data.system : this.system ?? false

    if (this.flags !== undefined) {
      this.flags = new UserFlagsUtil(this.flags)
    }

    return this
  }

  async presence(guild: GuildResolvable, options?: CacheManagerGetOptions): Promise<Presence | undefined> {
    const guildId = resolveGuildId(guild)
    if (!guildId) throw new DiscordooError('User#presence', 'Cannot get presence without guild id.')
    return this.client.presences.cache.get(this.id, { ...options, storage: guildId })
  }

  async presences(options?: CacheManagerFilterOptions): Promise<Presence[]> {
    return this.client.presences.cache.filter(p => p.userId === this.id, options) // TODO: context
      .then(results => results.map(result => result[1])) // FIXME: low performance
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
    return this.avatar ? this.client.internals.rest.cdn.avatar(this.id, this.avatar, options) : undefined
  }

  defaultAvatarUrl(): string {
    return this.client.internals.rest.cdn.defaultAvatar(this.discriminator ?? '0000')
  }

  displayAvatarUrl(options?: ImageUrlOptions): string {
    return this.avatarUrl(options) ?? this.defaultAvatarUrl()
  }

  bannerUrl(options?: ImageUrlOptions): string | undefined {
    return this.banner ? this.client.internals.rest.cdn.banner(this.id, this.banner, options) : undefined
  }

  toString(): string {
    return `<@${this.id}>`
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
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
      system: true,
      username: true,
      verified: true
    }, obj)
  }

}
