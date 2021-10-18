import { EntitiesCacheManager, EntitiesUtil, GuildMember, GuildResolvable, UserResolvable } from '@src/api'
import { Client } from '@src/core'
import { Keyspaces } from '@src/constants'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { GuildMemberEditData } from '@src/api/entities/member/interfaces/GuildMemberEditData'
import { RawGuildMemberEditData } from '@src/api/entities/member/interfaces/RawGuildMemberEditData'
import { resolveChannelId, resolveGuildId, resolveRoleId, resolveUserId } from '@src/utils/resolve'
import { DiscordooError } from '@src/utils'
import { filterAndMap } from '@src/utils/filterAndMap'
import { MemberEditOptions } from '@src/api/managers/members/MemberEditOptions'
import { MemberBanOptions } from '@src/api/managers/members/MemberBanOptions'

export class ClientMembersManager extends EntitiesManager {
  public cache: EntitiesCacheManager<GuildMember>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<GuildMember>(this.client, {
      keyspace: Keyspaces.GUILD_MEMBERS,
      storage: 'global',
      entity: 'GuildMember',
      policy: 'members'
    })
  }

  async edit<R = GuildMember>(
    guild: GuildResolvable,
    user: UserResolvable /* | MemberResolvable */,
    data: GuildMemberEditData | RawGuildMemberEditData,
    options: MemberEditOptions = {}
  ): Promise<R | undefined> {
    const userId = resolveUserId(user),
      guildId = resolveGuildId(guild)

    if (!userId) throw new DiscordooError('ClientMembersManager#edit', 'Cannot edit member without id.')
    if (!guildId) throw new DiscordooError('ClientMembersManager#edit', 'Cannot edit member without guild id.')

    const payload: RawGuildMemberEditData = {}

    if ('mute' in data) {
      payload.mute = !!data.mute
    }

    if ('deaf' in data) {
      payload.deaf = !!data.deaf
    }

    if (data.roles) {
      payload.roles = filterAndMap(
        data.roles,
        (r) => resolveRoleId(r) !== undefined,
        (r) => resolveRoleId(r)
      )
    }

    if ('channel' in data) {
      if (data.channel === null) {
        payload.channel_id = null
      } else {
        const id = resolveChannelId(data.channel)
        if (id) payload.channel_id = id
      }
    } else if ('channel_id' in data) {
      if (data.channel_id !== undefined) payload.channel_id = data.channel_id
    }

    const response = await this.client.internals.actions.editGuildMember(guildId, userId, payload, options.reason)

    if (response.success) {
      const GuildMember = EntitiesUtil.get('GuildMember')

      if (options.patchEntity) {
        return await options.patchEntity.init(response.result) as any
      } else {
        return await new GuildMember(this.client).init({ ...response.result, guild_id: guildId }) as any
      }
    }

    return undefined
  }

  async ban(
    guild: GuildResolvable,
    user: UserResolvable /* | MemberResolvable */,
    options: MemberBanOptions = {}
  ): Promise<boolean> {
    const userId = resolveUserId(user),
      guildId = resolveGuildId(guild)

    if (!userId) throw new DiscordooError('ClientMembersManager#ban', 'Cannot ban member without id.')
    if (!guildId) throw new DiscordooError('ClientMembersManager#ban', 'Cannot ban member without guild id.')

    const response = await this.client.internals.actions.banGuildMember(guildId, userId, options.deleteMessagesDays, options.reason)

    return response.success
  }

  async unban(
    guild: GuildResolvable,
    user: UserResolvable /* | MemberResolvable */,
    reason?: string
  ): Promise<boolean> {
    const userId = resolveUserId(user),
      guildId = resolveGuildId(guild)

    if (!userId) throw new DiscordooError('ClientMembersManager#unban', 'Cannot unban member without id.')
    if (!guildId) throw new DiscordooError('ClientMembersManager#unban', 'Cannot unban member without guild id.')

    const response = await this.client.internals.actions.unbanGuildMember(guildId, userId, reason)

    return response.success
  }

  async kick(
    guild: GuildResolvable,
    user: UserResolvable /* | MemberResolvable */,
    reason?: string
  ): Promise<boolean> {
    const userId = resolveUserId(user),
      guildId = resolveGuildId(guild)

    if (!userId) throw new DiscordooError('ClientMembersManager#ban', 'Cannot kick member without id.')
    if (!guildId) throw new DiscordooError('ClientMembersManager#ban', 'Cannot kick member without guild id.')

    const response = await this.client.internals.actions.kickGuildMember(guildId, userId, reason)

    return response.success
  }
}
