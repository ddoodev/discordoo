import { RawUserData } from '@src/api/entities/user'

export interface RawGuildMemberData {
  user: RawUserData
  nick?: string
  avatar?: string
  roles: string[]
  joined_at: string
  premium_since?: string
  deaf: boolean
  mute: boolean
  pending?: boolean
  permissions?: string
  communication_disabled_until?: string
  // DISCORD DOES NOT RETURN THIS PROPERTY.
  guild_id?: string
  // DISCORD DOES NOT RETURN THIS PROPERTY.
  guild_owner?: boolean
}
