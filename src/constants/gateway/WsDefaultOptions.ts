import { GatewayOptions } from '@src/gateway'
import { WebSocketUtils } from '@src/utils'

export const WS_DEFAULT_OPTIONS: Omit<GatewayOptions, 'token'> = {
  properties: {
    $browser: 'Discordoo',
    $device: 'Discordoo',
    $os: process.platform
  },
  compress: false,
  intents: 32509, // use all intents except privileged
  maxShards: Infinity,
  version: 9,
  shards: 1,
  url: 'wss://gateway.discord.gg',
  spawnDelay: 5000,
  encoding: WebSocketUtils.encoding,
  useReconnectOnly: false,
  smoothEventsPeaks: false,
  eventPeaksSmoothingMultiplier: 2,
  maxEventsPerSecond: undefined
}
