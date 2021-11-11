import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { Client } from '@src/core'
import { EntitiesCacheManager, UserResolvable } from '@src/api'
import { ThreadMember } from '@src/api/entities/member/ThreadMember'
import { DiscordooError, resolveChannelId, resolveGuildId } from '@src/utils'
import { ThreadMembersManagerData } from '@src/api/managers/members/ThreadMembersManagerData'
import { Keyspaces } from '@src/constants'
import { GuildMemberResolvable } from '@src/api/entities/member/interfaces/GuildMemberResolvable'
import { ThreadMemberResolvable } from '@src/api/entities/member/interfaces/ThreadMemberResolvable'

export class ThreadMembersManager extends EntitiesManager {
  public cache: EntitiesCacheManager<ThreadMember>
  public threadId: string
  public guildId: string

  constructor(client: Client, data: ThreadMembersManagerData) {
    super(client)

    const threadId = resolveChannelId(data.thread)
    if (!threadId) throw new DiscordooError('ThreadMembersManager', 'Cannot operate without thread id.')
    this.threadId = threadId

    const guildId = resolveGuildId(data.guild)
    if (!guildId) throw new DiscordooError('ThreadMembersManager', 'Cannot operate without guild id.')
    this.guildId = guildId

    this.cache = new EntitiesCacheManager<ThreadMember>(this.client, {
      keyspace: Keyspaces.THREAD_MEMBERS,
      storage: threadId,
      entity: 'ThreadMember',
      policy: 'members'
    })
  }

  remove(user: UserResolvable | GuildMemberResolvable | ThreadMemberResolvable | '@me'): Promise<boolean> {
    return this.client.threadMembers.remove(this.threadId, user)
  }

  add(user: UserResolvable | GuildMemberResolvable | ThreadMemberResolvable | '@me'): Promise<boolean> {
    return this.client.threadMembers.add(this.threadId, user)
  }

}
