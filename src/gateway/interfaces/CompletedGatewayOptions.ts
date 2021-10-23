export interface CompletedGatewayOptions {
  totalShards: number
  shards: number[]
  useReconnectOnly: boolean
  url: string
  handshakeTimeout: number
  compress: boolean
  encoding: 'json' | 'etf'
  token: string
  intents: number
  version: number
  properties: any // TODO
  presence?: any // TODO
}
