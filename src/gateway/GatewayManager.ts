import { GatewayBotInfo, GatewayProvider, GatewayShardsInfo } from '@discordoo/providers'
import { GatewayManagerOptions } from '@src/gateway/interfaces'
import { Client, ProviderConstructor } from '@src/core'
import { DiscordooError } from '@src/utils'
import { Endpoints } from '@src/constants'

export class GatewayManager<P extends GatewayProvider = GatewayProvider> {
  public provider: P
  public client: Client

  constructor(client: Client, Provider: ProviderConstructor<P>, options: GatewayManagerOptions) {
    this.client = client
    this.provider = new Provider(this.client, options.provider)
  }

  // TODO: resolvable shards

  connect(shards?: GatewayShardsInfo) {
    return this.provider.connect(shards)
  }

  disconnect(shards?: number[]) {
    return this.provider.disconnect(shards)
  }

  ping(): number
  ping(shards: number[]): number[]
  ping(shards?: number[]): number | number[] {
    return this.provider.ping(shards!) // FIXME
  }

  emit(event: string, ...data: any[]) { // TODO: events overload protection
    this.client.emit(event as any, ...data)
  }

  reorganizeShards(shards: GatewayShardsInfo): Promise<unknown> {
    return this.provider.reorganizeShards(shards)
  }

  async getGateway(): Promise<GatewayBotInfo> {
    const response = await this.client.internals.rest.api()
      .url(Endpoints.GATEWAY_BOT())
      .get<GatewayBotInfo>()

    if (response.success) return response.result
    else throw new DiscordooError('GatewayManager', 'Get gateway request ended with error:', response.result)
  }

  send(data: Record<string, any>, shards?: number[]): unknown {
    return this.provider.send(data, shards)
  }

  async waitShardSpawnTurn(shardID: number): Promise<unknown> { // TODO
    return void 100500
  }

  async init() {
    await this.provider.init()
    // TODO: and overload protector init
  }
}
