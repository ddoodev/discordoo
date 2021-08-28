import { GatewayIdentifyProperties, GatewayPresenceUpdateData } from 'discord-api-types/gateway/v9'

export interface WebSocketManagerOptions {
  totalShards: number
  shards: number[]
  useReconnectOnly: boolean
  url: string
  handshakeTimeout: number
  compress: boolean
  encoding: 'json' | 'etf'
  token: string
  intents: number
  properties: GatewayIdentifyProperties
  presence: GatewayPresenceUpdateData
}
