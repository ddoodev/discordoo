import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { GuildMemberData, Json, Permissions, RawGuildMemberData, ToJsonProperties, User } from '@src/api'
import { ToJsonOverrideSymbol } from '@src/constants'
import { mergeNewOrSave } from '@src/utils'
import { filterAndMap } from '@src/utils/filterAndMap'
import { resolveRoleId, resolveUserId } from '@src/utils/resolve'
import { CacheManagerGetOptions } from '@src/cache'

export class GuildMember extends AbstractEntity {
  public avatar?: string
  public deaf!: boolean
  public joinedDate!: Date
  public mute!: boolean
  public nick?: string
  public pending?: boolean
  public permissions!: Permissions
  public premiumSinceDate?: Date
  public roles: string[] = []
  public userId?: string
  public guildId?: string

  async init(data: GuildMemberData | RawGuildMemberData): Promise<this> {
    mergeNewOrSave(this, data, [
      'avatar',
      'deaf',
      'mute',
      'nick',
      'pending',
      [ 'guildId', 'guild_id' ]
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

    if (data.roles) {
      this.roles = filterAndMap(
        data.roles,
        (r) => resolveRoleId(r) !== undefined,
        (r) => resolveRoleId(r)
      )
    }

    if ('userId' in data) {
      this.userId = data.userId
    } else if (data.user) {
      this.userId = resolveUserId(data.user)
    }

    return this
  }

  async user(options?: CacheManagerGetOptions): Promise<User | undefined> {
    return this.userId ? this.client.users.cache.get(this.userId, options) : undefined
  }

  async guild(options?: CacheManagerGetOptions): Promise<any | undefined> { // TODO: Guild
    return this.guildId ? this.client.guilds.cache.get(this.guildId, options) : undefined
  }

  get joinedTimestamp(): number {
    return this.joinedDate.getTime()
  }

  get premiumSinceTimestamp(): number | undefined {
    return this.premiumSinceDate?.getTime()
  }

  

  toJson(properties: ToJsonProperties, obj?: any): Json {
    return super.toJson({
      ...properties,
      avatar: true,
      deaf: true,
      joinedDate: true,
      mute: true,
      nick: true,
      pending: true,
      permissions: true,
      premiumSinceDate: true,
      roles: true,
      userId: {
        override: ToJsonOverrideSymbol,
        value: this.userId
      },
    }, obj)
  }

}
