import { EntitiesCacheManager, UserResolvable } from '@src/api'
import { DiscordApplication, DiscordRestApplication } from '@src/core'
import { Keyspaces } from '@src/constants'
import { ThreadMember } from '@src/api/entities/member/ThreadMember'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { ThreadChannelResolvable } from '@src/api/entities/channel/interfaces/ThreadChannelResolvable'
import { GuildMemberResolvable } from '@src/api/entities/member/interfaces/GuildMemberResolvable'
import { ThreadMemberResolvable } from '@src/api/entities/member/interfaces/ThreadMemberResolvable'
import { DiscordooError, resolveChannelId, resolveUserOrMemberId } from '@src/utils'

export class ApplicationThreadMembersManager extends EntitiesManager {
  public cache: EntitiesCacheManager<ThreadMember>

  constructor(app: DiscordRestApplication) {
    super(app)

    this.cache = new EntitiesCacheManager<ThreadMember>(this.app, {
      keyspace: Keyspaces.ThreadMembers,
      storage: 'global',
      entity: 'ThreadMember',
      policy: 'threadMembers'
    })
  }

  async add(
    thread: ThreadChannelResolvable, user: UserResolvable | GuildMemberResolvable | ThreadMemberResolvable | '@me'
  ): Promise<boolean> {
    const channelId = resolveChannelId(thread),
      userId = user === '@me' ? user : resolveUserOrMemberId(user)

    if (!channelId) {
      throw new DiscordooError('ApplicationThreadMembersManager#add', 'Cannot add member without thread id.')
    }
    if (!userId) {
      throw new DiscordooError('ApplicationThreadMembersManager#add', 'Cannot add member without member id.')
    }

    const response = await this.app.internals.actions.addThreadMember(channelId, userId)

    return response.success
  }

  async remove(
    thread: ThreadChannelResolvable, user: UserResolvable | GuildMemberResolvable | ThreadMemberResolvable | '@me'
  ): Promise<boolean> {
    const channelId = resolveChannelId(thread),
      userId = user === '@me' ? user : resolveUserOrMemberId(user)

    if (!channelId) {
      throw new DiscordooError('ApplicationThreadMembersManager#remove', 'Cannot remove member without thread id.')
    }
    if (!userId) {
      throw new DiscordooError('ApplicationThreadMembersManager#remove', 'Cannot remove member without member id.')
    }

    const response = await this.app.internals.actions.removeThreadMember(channelId, userId)

    return response.success
  }

}
