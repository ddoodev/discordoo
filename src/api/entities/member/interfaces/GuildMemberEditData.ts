import { RoleResolvable } from '@src/api'

export interface GuildMemberEditData {
  nick?: string | null
  roles?: RoleResolvable[]
  voiceMute?: boolean
  voiceDeaf?: boolean
  channel?: /* TODO: VoiceChannelResolvable */ any | null
  muteUntil?: Date | string | number | null
}
