import { CompletedGatewayOptions } from '@src/gateway/interfaces/GatewayOptions'
import { WebSocketUtils } from '@src/utils/WebSocketUtils'
import { IntentsUtil } from '@src/utils/IntentsUtil'

export const WS_DEFAULT_OPTIONS: CompletedGatewayOptions = {
  token: '',
  intents: IntentsUtil.NON_PRIVILEGED_NUMERIC,
  presence: {
    status: 'online'
  },
  sharding: {
    shards: [ 0 ],
    totalShards: 1
  },
  connection: {
    properties: {
      $browser: 'Discordoo',
      $device: 'Discordoo',
      $os: process.platform
    },
    handshakeTimeout: 30_000,
    compress: false,
    largeThreshold: 50,
    version: 10,
    url: 'wss://gateway.discord.gg',
    encoding: WebSocketUtils.encoding
  },
  events: {
    loadDistribution: false,
    loadDistributionMultiplier: 2,
    secondLimit: Infinity
  }
}
