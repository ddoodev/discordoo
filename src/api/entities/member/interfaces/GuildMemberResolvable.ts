import { GuildMember, GuildMemberData, RawGuildMemberData, Resolvable } from '@src/api'

export type GuildMemberResolvable = Resolvable<GuildMember | GuildMemberData | RawGuildMemberData>
