import { RoleResolvable } from '@src/api'

export interface GuildMemberAddData {
  accessToken: string
  nick?: string
  deaf?: boolean
  mute?: boolean
  roles?: RoleResolvable[]
}
