import { Collection } from '@discordoo/collection'
import { GuildMembersChunkHandlerContext } from '@src/events/interfaces/GuildMembersChunkHandlerContext'

export interface ClientQueues {
  members: Collection<string, GuildMembersChunkHandlerContext>
}
