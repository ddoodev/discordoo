import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { GuildMemberData, Json, RawGuildMemberData, ReadonlyPermissions, ToJsonProperties, User } from '@src/api'
import { Keyspaces, PermissionFlags, ToJsonOverrideSymbol } from '@src/constants'
import { attach, DiscordooError, ImageUrlOptions, WebSocketUtils } from '@src/utils'
import { filterAndMap } from '@src/utils/filterAndMap'
import { resolveRoleId, resolveUserId } from '@src/utils/resolve'
import { CacheManagerGetOptions } from '@src/cache'
import { GuildMemberRolesManager } from '@src/api/managers/members/GuildMemberRolesManager'
import { Presence } from '@src/api/entities/presence/Presence'
import { GuildMemberEditData } from '@src/api/entities/member/interfaces/GuildMemberEditData'
import { MemberBanOptions } from '@src/api/managers/members/MemberBanOptions'
import { makeCachePointer } from '@src/utils/cachePointer'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class GuildMember extends AbstractEntity {
  public avatar?: string
  public voiceDeaf?: boolean
  public declare joinedDate: Date
  public voiceMute?: boolean
  public nick?: string
  public pending?: boolean
  public declare permissions: ReadonlyPermissions
  public premiumSinceDate?: Date
  public declare roles: GuildMemberRolesManager
  public rolesList: string[] = []
  public declare userId: string
  public declare guildId: string
  public declare guildOwner: boolean

  private _muteUntilRaw?: string

  async init(data: GuildMemberData | RawGuildMemberData, options?: EntityInitOptions): Promise<this> {
    attach(this, data, {
      props: [
        'avatar',
        [ 'voiceDeaf', 'deaf' ],
        [ 'voiceMute', 'mute' ],
        'nick',
        'pending',
        [ 'guildId', 'guild_id' ],
        [ 'guildOwner', 'guild_owner' ],
        [ '_muteUntilRaw', 'communication_disabled_until' ],
      ],
      disabled: options?.ignore,
      enabled: [ 'guildId', 'guildOwner', 'pending' ]
    })

    if ('joined_at' in data) {
      this.joinedDate = new Date(data.joined_at)
    } else if ('joinedDate' in data) {
      this.joinedDate = new Date(data.joinedDate)
    }

    if ('premium_since' in data && data.premium_since) {
      this.premiumSinceDate = new Date(data.premium_since)
    } else if ('premiumSinceDate' in data && data.premiumSinceDate) {
      this.premiumSinceDate = new Date(data.premiumSinceDate)
    }

    if ('userId' in data && (data.userId || data.user)) {
      const id = data.userId ?? (data.user ? resolveUserId(data.user) : undefined)
      if (id) this.userId = id
    } else if (data.user) {
      const id = resolveUserId(data.user)
      if (id) this.userId = id
    }

    if (!this.userId) {
      throw new DiscordooError('GuildMember', 'Cannot operate without user id provided.')
    }

    if (!this.guildId) {
      throw new DiscordooError('GuildMember', 'Cannot operate without guild id provided.')
    }

    if (!this.roles) {
      this.roles = new GuildMemberRolesManager(this.client, {
        user: this.userId,
        guild: this.guildId,
      })
    }

    if (data.roles) {
      await this.roles.cache.clear()

      this.rolesList = filterAndMap(
        data.roles,
        (r) => resolveRoleId(r) !== undefined,
        (r) => resolveRoleId(r)
      )

      for await (const role of this.rolesList) {
        await this.roles.cache.set(role, makeCachePointer(Keyspaces.GUILD_ROLES, this.guildId, role))
      }
    }

    if (WebSocketUtils.exists(data.permissions)) {
      this.permissions = new ReadonlyPermissions(this.guildOwner ? PermissionFlags.ADMINISTRATOR : data.permissions)
    }

    if (typeof this._muteUntilRaw === 'string') {
      const time = new Date(this._muteUntilRaw).getTime()

      if (time <= Date.now()) delete this._muteUntilRaw
    }

    return this
  }

  async user(options?: CacheManagerGetOptions): Promise<User | undefined> {
    return this.client.users.cache.get(this.userId, options)
  }

  async guild(options?: CacheManagerGetOptions): Promise<any | undefined> { // TODO: Guild
    return this.client.guilds.cache.get(this.guildId, options)
  }

  async presence(options?: CacheManagerGetOptions): Promise<Presence | undefined> {
    return this.client.internals.cache.get('presences', this.guildId, 'Presence', this.userId, options)
  }

  get joinedTimestamp(): number {
    return this.joinedDate.getTime()
  }

  get premiumSinceTimestamp(): number | undefined {
    return this.premiumSinceDate?.getTime()
  }

  get muteUntilTimestamp(): number | undefined {
    const date = this._muteUntilRaw ? new Date(this._muteUntilRaw) : undefined
    let time = date?.getTime()

    if (time && time <= Date.now()) {
      delete this._muteUntilRaw
      time = undefined
    }

    return time
  }

  get muteUntilDate(): Date | undefined {
    let date = this._muteUntilRaw ? new Date(this._muteUntilRaw) : undefined
    const time = date?.getTime()

    if (time && time <= Date.now()) {
      delete this._muteUntilRaw
      date = undefined
    }

    return date
  }

  avatarUrl(options?: ImageUrlOptions): string | undefined {
    return this.avatar ? this.client.internals.rest.cdn.guildMemberAvatar(this.guildId, this.userId, this.avatar, options) : undefined
  }

  edit(data: GuildMemberEditData, reason?: string): Promise<this | undefined> {
    return this.client.members.edit(this.guildId, this.userId, data, { reason, patchEntity: this })
  }

  setNick(nick: string, reason?: string) {
    return this.edit({ nick }, reason)
  }

  setVoiceDeaf(voiceDeaf: boolean, reason?: string) {
    return this.edit({ voiceDeaf }, reason)
  }

  setVoiceMute(voiceMute: boolean, reason?: string) {
    return this.edit({ voiceMute }, reason)
  }

  muteUntil(muteUntil: Date | number | string | null, reason?: string) {
    return this.edit({ muteUntil }, reason)
  }

  async ban(options?: MemberBanOptions): Promise<this | undefined> {
    const result = await this.client.members.ban(this.guildId, this.userId, options)
    return result ? this : undefined
  }

  async kick(reason?: string): Promise<this | undefined> {
    const result = await this.client.members.kick(this.guildId, this.userId, reason)
    return result ? this : undefined
  }

  async unban(reason?: string): Promise<this | undefined> {
    const result = await this.client.members.unban(this.guildId, this.userId, reason)
    return result ? this : undefined
  }

  toString(): string {
    return `<@${this.nick ? '!' : ''}${this.userId}>`
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      avatar: true,
      voiceDeaf: true,
      joinedDate: true,
      voiceMute: true,
      nick: true,
      pending: true,
      permissions: true,
      premiumSinceDate: true,
      guildId: true,
      guildOwner: true,
      _muteUntilRaw: true,
      userId: true,
      roles: {
        override: ToJsonOverrideSymbol,
        value: this.rolesList
      },
    }, obj)
  }

}
