import { RawGuildMemberData, RawPresenceData } from '@src/api'

export interface RawGuildMembersChunkData {
  guild_id: string
  members: RawGuildMemberData[]
  chunk_index: number
  chunk_count: number
  not_found?: any[]
  presences?: RawPresenceData[]
  nonce?: string
}
