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
  properties: any // TODO
  presence: any // TODO
}
