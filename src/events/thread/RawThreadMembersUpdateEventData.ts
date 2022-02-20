import { RawGuildMemberData, RawPresenceData, RawThreadMemberData } from '@src/api'

export interface RawThreadMembersUpdateEventData {
  id: string
  guild_id: string
  member_count: number
  added_members?: Array<RawThreadMemberData & { member: RawGuildMemberData; presence?: RawPresenceData }>
  removed_member_ids?: string[]
}