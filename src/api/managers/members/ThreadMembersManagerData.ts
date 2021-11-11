import { ThreadChannelResolvable } from '@src/api/entities/channel/interfaces/ThreadChannelResolvable'
import { GuildResolvable } from '@src/api'

export interface ThreadMembersManagerData {
  thread: ThreadChannelResolvable
  guild: GuildResolvable
}
