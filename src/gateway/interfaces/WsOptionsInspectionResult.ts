import { APIGatewayBotInfo } from 'discord-api-types'

export interface WsOptionsInspectionResult {
  gateway: APIGatewayBotInfo
  shardsToSpawn: number[]
  shardsInTotal: number
  url: string
}
