import { GatewayBotInfo, GatewayProvider, GatewaySendOptions, GatewaySendPayloadLike, GatewayShardsInfo } from '@discordoo/providers'
import { GatewayManagerData } from '@src/gateway/interfaces'
import { Client, ProviderConstructor } from '@src/core'
import { DiscordooError, ValidationError, wait } from '@src/utils'
import { Endpoints } from '@src/constants'
import { CompletedGatewayOptions } from '@src/gateway/interfaces/GatewayOptions'

export class GatewayManager<P extends GatewayProvider = GatewayProvider> {
  public provider: P
  public client: Client
  public options: CompletedGatewayOptions

  constructor(client: Client, Provider: ProviderConstructor<P>, data: GatewayManagerData) {
    this.client = client
    this.provider = new Provider(this.client, data.gatewayOptions, data.providerOptions)
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

  emit(shardId: number, event: string, ...data: any[]) { // TODO: events overload protection
    return this.client.internals.events.handlers.get(event)?.execute(shardId, ...data)
  }

  reorganizeShards(shards: GatewayShardsInfo): Promise<unknown> {
    return this.provider.reorganizeShards(shards)
  }

  reconnect(shards?: number[]) {
    return this.provider.reconnect(shards)
  }

  async getGateway(): Promise<GatewayBotInfo> {
    const response = await this.client.internals.rest.api()
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
    await wait(6000)
  }

  async init() {
    await this.provider.init()
    // TODO: and overload protector init
  }
}
