import { GuildMember } from '@src/api'

export interface MemberEditOptions {
  reason?: string
  patchEntity?: GuildMember
}
