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

export class GuildMember extends AbstractEntity {
  public avatar?: string
  public voiceDeaf!: boolean
  public joinedDate!: Date
  public voiceMute!: boolean
  public nick?: string
  public pending?: boolean
  public permissions!: ReadonlyPermissions
  public premiumSinceDate?: Date
  public roles!: GuildMemberRolesManager
  public rolesList: string[] = []
  public userId!: string
  public guildId!: string
  public guildOwner!: boolean
  public muteUntilDate?: Date

  async init(data: GuildMemberData | RawGuildMemberData): Promise<this> {
    attach(this, data, [
      'avatar',
      [ 'voiceDeaf', 'deaf', ],
      [ 'voiceMute', 'mute' ],
      'nick',
      'pending',
      [ 'guildId', 'guild_id' ],
      [ 'guildOwner', 'guild_owner' ],
      [ 'muteUntilDate', 'communication_disabled_until' ],
    ])

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

    if (typeof this.muteUntilDate === 'string'!) {
      this.muteUntilDate = new Date(this.muteUntilDate!)
    }

    return this
  }

  async user(options?: CacheManagerGetOptions): Promise<User | undefined> {
    return this.userId ? this.client.users.cache.get(this.userId, options) : undefined
  }

  async guild(options?: CacheManagerGetOptions): Promise<any | undefined> { // TODO: Guild
    return this.guildId ? this.client.guilds.cache.get(this.guildId, options) : undefined
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
    return this.muteUntilDate?.getTime()
  }

  avatarUrl(options?: ImageUrlOptions): string | undefined {
    return this.avatar ? this.client.internals.rest.cdn().guildMemberAvatar(this.guildId, this.userId, this.avatar, options) : undefined
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

  muteUntil(muteUntil: Date | number | string | null, reason?: string): Promise<this | undefined> {
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
      muteUntilDate: true,
      roles: {
        override: ToJsonOverrideSymbol,
        value: this.rolesList
      },
      userId: {
        override: ToJsonOverrideSymbol,
        value: this.userId
      },
    }, obj)
  }

}
