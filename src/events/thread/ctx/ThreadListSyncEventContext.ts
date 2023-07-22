import { AbstractEventContext } from '@src/events/interfaces/AbstractEventContext'
import { Collection } from '@discordoo/collection'
import { AnyThreadChannel } from '@src/api/entities/channel/interfaces/AnyThreadChannel'
import { ThreadMember } from '@src/api/entities/member/ThreadMember'

export interface ThreadListSyncEventContext extends AbstractEventContext {
  threads: Collection<string, AnyThreadChannel>
  members: Collection<string, ThreadMember>
  // The parent channel ids whose threads are being synced. If omitted, then threads were synced for the entire guild.
  parents?: string[]
  guildId: string
}