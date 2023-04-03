import { ChannelResolvable, GuildMemberResolvable, MessageResolvable, RoleResolvable, UserResolvable } from '@src/api'

export interface InteractionResolvedData {
  users?: UserResolvable[]
  members?: GuildMemberResolvable[]
  roles?: RoleResolvable[]
  channels?: ChannelResolvable[]
  messages?: MessageResolvable[]
}
