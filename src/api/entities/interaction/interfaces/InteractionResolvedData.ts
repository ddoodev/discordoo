import { ChannelResolvable, MessageResolvable, RoleResolvable, UserResolvable } from '@src/api'
import { GuildMemberResolvable } from '@src/api/entities/member/interfaces/GuildMemberResolvable'

export interface InteractionResolvedData {
  users?: UserResolvable[]
  members?: GuildMemberResolvable[]
  roles?: RoleResolvable[]
  channels?: ChannelResolvable[]
  messages?: MessageResolvable[]
}