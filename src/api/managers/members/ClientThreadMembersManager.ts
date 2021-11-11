import { EntitiesCacheManager, UserResolvable } from '@src/api'
import { Client } from '@src/core'
import { Keyspaces } from '@src/constants'
import { ThreadMember } from '@src/api/entities/member/ThreadMember'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { ThreadChannelResolvable } from '@src/api/entities/channel/interfaces/ThreadChannelResolvable'
import { GuildMemberResolvable } from '@src/api/entities/member/interfaces/GuildMemberResolvable'
import { ThreadMemberResolvable } from '@src/api/entities/member/interfaces/ThreadMemberResolvable'
import { DiscordooError, resolveGuildId, resolveUserOrMemberId } from '@src/utils'

export class ClientThreadMembersManager extends EntitiesManager {
  public cache: EntitiesCacheManager<ThreadMember>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<ThreadMember>(this.client, {
      keyspace: Keyspaces.THREAD_MEMBERS,
      storage: 'global',
      entity: 'ThreadMember',
      policy: 'threadMembers'
    })
  }

  async add(
    thread: ThreadChannelResolvable, user: UserResolvable | GuildMemberResolvable | ThreadMemberResolvable | '@me'
  ): Promise<boolean> {
    const channelId = resolveGuildId(thread),
      userId = user === '@me' ? user : resolveUserOrMemberId(user)

    if (!channelId) {
      throw new DiscordooError('ClientThreadMembersManager#add', 'Cannot add member without thread id.')
    }
    if (!userId) {
      throw new DiscordooError('ClientThreadMembersManager#add', 'Cannot add member without member id.')
    }

    const response = await this.client.internals.actions.addThreadMember(channelId, userId)

    return response.success
  }

  async remove(
    thread: ThreadChannelResolvable, user: UserResolvable | GuildMemberResolvable | ThreadMemberResolvable | '@me'
  ): Promise<boolean> {
    const channelId = resolveGuildId(thread),
      userId = user === '@me' ? user : resolveUserOrMemberId(user)

    if (!channelId) {
      throw new DiscordooError('ClientThreadMembersManager#remove', 'Cannot remove member without thread id.')
    }
    if (!userId) {
      throw new DiscordooError('ClientThreadMembersManager#remove', 'Cannot remove member without member id.')
    }

    const response = await this.client.internals.actions.removeThreadMember(channelId, userId)

    return response.success
  }

}
