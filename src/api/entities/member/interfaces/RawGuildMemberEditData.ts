export interface RawGuildMemberEditData {
  nick?: string | null
  roles?: string[]
  mute?: boolean
  deaf?: boolean
  channel_id?: string | null
  communication_disabled_until?: string | null
}
