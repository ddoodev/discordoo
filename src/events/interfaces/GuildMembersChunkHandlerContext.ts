import { GuildMembersChunkEventContext } from '@src/events'
import { GuildMember } from '@src/api'

export interface GuildMembersChunkHandlerContext {
  handler: (
    eventContext: GuildMembersChunkEventContext, executionContext: GuildMembersChunkHandlerContext
  ) => GuildMembersChunkHandlerContext | true
  resolve: any
  reject: any
  timeout: NodeJS.Timeout
  fetched: GuildMember[][]
  nonce: string
}
