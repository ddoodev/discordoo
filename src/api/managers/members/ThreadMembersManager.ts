import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { EntitiesCacheManager, UserResolvable } from '@src/api'
import { ThreadMember } from '@src/api/entities/member/ThreadMember'
import { DiscordooError, resolveChannelId, resolveGuildId } from '@src/utils'
import { ThreadMembersManagerData } from '@src/api/managers/members/ThreadMembersManagerData'
import { Keyspaces } from '@src/constants'
import { GuildMemberResolvable } from '@src/api/entities/member/interfaces/GuildMemberResolvable'
import { ThreadMemberResolvable } from '@src/api/entities/member/interfaces/ThreadMemberResolvable'
import { RestEligibleDiscordApplication } from '@src/core/apps/AnyDiscordApplication'

export class ThreadMembersManager extends EntitiesManager {
  public cache: EntitiesCacheManager<ThreadMember>
  public threadId: string
  public guildId: string

  constructor(app: RestEligibleDiscordApplication, data: ThreadMembersManagerData) {
    super(app)

    const threadId = resolveChannelId(data.thread)
    if (!threadId) throw new DiscordooError('ThreadMembersManager', 'Cannot operate without thread id.')
    this.threadId = threadId

    const guildId = resolveGuildId(data.guild)
    if (!guildId) throw new DiscordooError('ThreadMembersManager', 'Cannot operate without guild id.')
    this.guildId = guildId

    this.cache = new EntitiesCacheManager<ThreadMember>(this.app, {
      keyspace: Keyspaces.ThreadMembers,
      storage: threadId,
      entity: 'ThreadMember',
      policy: 'members'
    })
  }

  remove(user: UserResolvable | GuildMemberResolvable | ThreadMemberResolvable | '@me'): Promise<boolean> {
    return this.app.threadMembers.remove(this.threadId, user)
  }

  add(user: UserResolvable | GuildMemberResolvable | ThreadMemberResolvable | '@me'): Promise<boolean> {
    return this.app.threadMembers.add(this.threadId, user)
  }

}
