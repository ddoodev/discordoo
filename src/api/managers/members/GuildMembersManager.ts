import {
  EntitiesCacheManager,
  GuildMember,
  GuildMemberAddData, GuildMemberResolvable,
  GuildMembersFetchOptions, MemberBanOptions,
  RawGuildMemberAddData,
  UserResolvable
} from '@src/api'
import { Keyspaces } from '@src/constants/cache/Keyspaces'
import { GuildMembersManagerData } from '@src/api/managers/members/GuildMembersManagerData'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { DiscordooError, resolveGuildId } from '@src/utils'
import { RestEligibleDiscordApplication } from '@src/core/apps/AnyDiscordApplication'

export class GuildMembersManager extends EntitiesManager {
  public cache: EntitiesCacheManager<GuildMember>
  public guildId: string

  constructor(app: RestEligibleDiscordApplication, data: GuildMembersManagerData) {
    super(app)

    const guildId = resolveGuildId(data.guild)
    if (!guildId) throw new DiscordooError('GuildMembersManager', 'Cannot operate without guild id.')
    this.guildId = guildId

    this.cache = new EntitiesCacheManager<GuildMember>(this.app, {
      keyspace: Keyspaces.GuildMembers,
      storage: this.guildId,
      entity: 'GuildMember',
      policy: 'members'
    })
  }

  async add(user: UserResolvable, data: GuildMemberAddData | RawGuildMemberAddData): Promise<GuildMember | undefined> {
    return this.app.members.add(this.guildId, user, data)
  }

  async fetchOne(user: UserResolvable): Promise<GuildMember | undefined> {
    return this.app.members.fetchOne(this.guildId, user)
  }

  async fetchMany(options: GuildMembersFetchOptions): Promise<GuildMember[]> {
    return this.app.members.fetchMany(this.guildId, options)
  }

  async fetch(
    userOrOptions: UserResolvable | GuildMemberResolvable | GuildMembersFetchOptions
  ): Promise<GuildMember | GuildMember[] | undefined> {
    return this.app.members.fetch(this.guildId, userOrOptions)
  }

  async edit(user: UserResolvable, data: GuildMemberAddData): Promise<GuildMember | undefined> {
    return this.app.members.edit(this.guildId, user, data)
  }

  async kick(user: UserResolvable): Promise<boolean> {
    return this.app.members.kick(this.guildId, user)
  }

  async ban(user: UserResolvable, options?: MemberBanOptions): Promise<boolean> {
    return this.app.members.ban(this.guildId, user, options)
  }

  async unban(user: UserResolvable): Promise<boolean> {
    return this.app.members.unban(this.guildId, user)
  }

  async addRole(user: UserResolvable, roleId: string): Promise<boolean> {
    return this.app.members.addRole(this.guildId, user, roleId)
  }

  async removeRole(user: UserResolvable, roleId: string): Promise<boolean> {
    return this.app.members.removeRole(this.guildId, user, roleId)
  }
}