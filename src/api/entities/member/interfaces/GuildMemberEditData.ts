import { RoleResolvable } from '@src/api'

export interface GuildMemberEditData {
  nick?: string | null
  roles?: RoleResolvable[]
  mute?: boolean
  deaf?: boolean
  channel?: /* TODO: VoiceChannelResolvable */ any | null
}
