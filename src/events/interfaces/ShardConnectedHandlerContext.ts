import { Client } from '@src/core'

export interface ShardConnectedHandlerContext {
  handler: (client: Client, context: ShardConnectedHandlerContext) => void
  timeout: NodeJS.Timeout
  guilds: string[]
  guild?: string
  shardId: number
}