import { Client } from '@src/core'
import { RawUserData } from '@src/api'

export interface ShardConnectedHandlerContext {
  handler: (client: Client, context: ShardConnectedHandlerContext) => void
  timeout: NodeJS.Timeout
  guilds: string[]
  guild?: string
  shardId: number
  user: RawUserData
}