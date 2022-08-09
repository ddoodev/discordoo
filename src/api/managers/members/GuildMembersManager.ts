import {
  EntitiesCacheManager,
  GuildMember,
  GuildMemberAddData, GuildMemberResolvable,
  GuildMembersFetchOptions, MemberBanOptions,
  RawGuildMemberAddData,
  UserResolvable
} from '@src/api'
import { Client } from '@src/core'
import { Keyspaces } from '@src/constants/cache/Keyspaces'
import { GuildMembersManagerData } from '@src/api/managers/members/GuildMembersManagerData'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { DiscordooError, resolveGuildId } from '@src/utils'

export class GuildMembersManager extends EntitiesManager {
  public cache: EntitiesCacheManager<GuildMember>
  public guildId: string

  constructor(client: Client, data: GuildMembersManagerData) {
    super(client)

    const guildId = resolveGuildId(data.guild)
    if (!guildId) throw new DiscordooError('GuildMembersManager', 'Cannot operate without guild id.')
    this.guildId = guildId

    this.cache = new EntitiesCacheManager<GuildMember>(this.client, {
      keyspace: Keyspaces.GUILD_MEMBERS,
      storage: this.guildId,
      entity: 'GuildMember',
      policy: 'members'
    })
  }

  async add(user: UserResolvable, data: GuildMemberAddData | RawGuildMemberAddData): Promise<GuildMember | undefined> {
    return this.client.members.add(this.guildId, user, data)
  }

  async fetchOne(user: UserResolvable): Promise<GuildMember | undefined> {
    return this.client.members.fetchOne(this.guildId, user)
  }

  async fetchMany(options: GuildMembersFetchOptions): Promise<GuildMember[]> {
    return this.client.members.fetchMany(this.guildId, options)
  }

  async fetch(
    userOrOptions: UserResolvable | GuildMemberResolvable | GuildMembersFetchOptions
  ): Promise<GuildMember | GuildMember[] | undefined> {
    return this.client.members.fetch(this.guildId, userOrOptions)
  }

  async edit(user: UserResolvable, data: GuildMemberAddData): Promise<GuildMember | undefined> {
    return this.client.members.edit(this.guildId, user, data)
  }

  async kick(user: UserResolvable): Promise<boolean> {
    return this.client.members.kick(this.guildId, user)
  }

  async ban(user: UserResolvable, options?: MemberBanOptions): Promise<boolean> {
    return this.client.members.ban(this.guildId, user, options)
  }

  async unban(user: UserResolvable): Promise<boolean> {
    return this.client.members.unban(this.guildId, user)
  }

  async addRole(user: UserResolvable, roleId: string): Promise<boolean> {
    return this.client.members.addRole(this.guildId, user, roleId)
  }

  async removeRole(user: UserResolvable, roleId: string): Promise<boolean> {
    return this.client.members.removeRole(this.guildId, user, roleId)
  }
}