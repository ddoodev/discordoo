import { GuildMember, Presence } from '@src/api'
import { AbstractEventContext } from '@src/events/interfaces/AbstractEventContext'

export interface GuildMembersChunkEventContext extends AbstractEventContext {
  members: GuildMember[]
  presences?: Presence[]
  chunkIndex: number
  chunksExpected: number
  last: boolean
  guildId: string
  notFound?: any[]
  nonce?: string
}
