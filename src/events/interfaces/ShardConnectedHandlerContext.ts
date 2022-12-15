import { DiscordApplication } from '@src/core'
import { RawUserData } from '@src/api'

export interface ShardConnectedHandlerContext {
  handler: (app: DiscordApplication, context: ShardConnectedHandlerContext) => void
  timeout: NodeJS.Timeout
  guilds: string[]
  guild?: string
  shardId: number
  user: RawUserData
}