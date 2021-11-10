import { GuildMember, Presence } from '@src/api'

export interface GuildMembersChunkEventContext {
  members: GuildMember[]
  presences?: Presence[]
  chunkIndex: number
  chunksExpected: number
  last: boolean
  guildId: string
  notFound?: any[]
  nonce?: string
}
