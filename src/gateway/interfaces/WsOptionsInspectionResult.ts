import { APIGatewayBotInfo } from 'discord-api-types'

export default interface WsOptionsInspectionResult {
  gateway: APIGatewayBotInfo
  shardsToSpawn: number[]
  shardsInTotal: number
  url: string
}
