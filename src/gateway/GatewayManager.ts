import {
  GatewayBotInfo,
  GatewayProvider,
  GatewayReceivePayloadLike,
  GatewaySendOptions,
  GatewaySendPayloadLike,
  GatewayShardsInfo
} from '@discordoo/providers'
import { GatewayManagerData } from '@src/gateway/interfaces'
import { DiscordApplication, ProviderConstructor } from '@src/core'
import { DiscordooError, ValidationError, wait } from '@src/utils'
import { Endpoints, WebSocketClientEvents } from '@src/constants'
import { CompletedGatewayOptions } from '@src/gateway/interfaces/GatewayOptions'
import { rawToDiscordoo } from '@src/utils/rawToDiscordoo'

export class GatewayManager<P extends GatewayProvider = GatewayProvider> {
  public provider: P
  public app: DiscordApplication
  public options: CompletedGatewayOptions

  constructor(app: DiscordApplication, Provider: ProviderConstructor<P, DiscordApplication>, data: GatewayManagerData) {
    this.app = app
    this.provider = new Provider(this.app, data.gatewayOptions, data.providerOptions)
    this.options = data.gatewayOptions
  }

  connect(shards?: GatewayShardsInfo) {
    return this.provider.connect(shards)
  }

  disconnect(shards?: number[]) {
    return this.provider.disconnect(shards)
  }

  ping(): number
  ping(shards: number[]): Array<[ number, number ]>
  ping(shards?: number[]): number | Array<[ number, number ]> {
    return this.provider.ping(shards)
  }

  emit(shardId: number, packet: GatewayReceivePayloadLike) { // TODO: events overload protection
    this.app.emit('raw', packet)

    if (!packet.t) return
    const event = packet.t === WebSocketClientEvents.Connected ? 'shardConnected' : rawToDiscordoo(packet.t)

    return this.app.internals.events.handlers.get(event)?.execute(shardId, packet.d)
  }

  reorganizeShards(shards: GatewayShardsInfo): Promise<unknown> {
    return this.provider.reorganizeShards(shards)
  }

  reconnect(shards?: number[]) {
    return this.provider.reconnect(shards)
  }

  async getGateway(): Promise<GatewayBotInfo> {
    const response = await this.app.internals.rest.api()
      .url(Endpoints.GATEWAY_BOT())
      .get<GatewayBotInfo>()

    if (response.success) {
      return response.result
    } else {
      if (response.statusCode === 401) {
        throw new ValidationError('GatewayManager', 'Invalid token provided')
      } else {
        throw new DiscordooError('GatewayManager', 'Get gateway request ended with error:', response.result)
      }
    }
  }

  send(data: GatewaySendPayloadLike, options?: GatewaySendOptions): unknown {
    return this.provider.send(data, options)
  }

  // @ts-ignore
  async waitShardSpawnTurn(shardId: number): Promise<unknown> { // TODO
    await wait(15000)
  }

  async init() {
    await this.provider.init()
    // TODO: and overload protector init
  }
}
