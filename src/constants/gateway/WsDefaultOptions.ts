import { GatewayOptions } from '@src/gateway/interfaces/GatewayOptions'
import { WebSocketUtils } from '@src/utils/WebSocketUtils'
import { IntentsUtil } from '@src/utils/IntentsUtil'

export const WS_DEFAULT_OPTIONS: Required<Omit<GatewayOptions, 'token' | 'presence'>> = {
  properties: {
    $browser: 'Discordoo',
    $device: 'Discordoo',
    $os: process.platform
  },
  compress: false,
  intents: IntentsUtil.NON_PRIVILEGED.reduce((prev, curr) => prev | curr, 0),
  maxShards: Infinity,
  version: 9,
  shards: 1,
  url: 'wss://gateway.discord.gg',
  spawnDelay: 5000,
  encoding: WebSocketUtils.encoding,
  useReconnectOnly: false,
  smoothEventsPeaks: false,
  eventPeaksSmoothingMultiplier: 2,
  maxEventsPerSecond: Infinity,
  largeThreshold: 50,
  totalShards: 1,
  handshakeTimeout: 30_000,
}
