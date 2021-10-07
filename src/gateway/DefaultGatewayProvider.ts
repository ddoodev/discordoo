import { GatewayBotInfo, GatewayProvider, GatewayShardsInfo } from '@discordoo/providers'
import { Client } from '@src/core'
import { WebSocketManager } from '@src/gateway/WebSocketManager'
import { WebSocketManagerOptions } from '@src/gateway/interfaces/WebSocketManagerOptions'
import { rawToDiscordoo } from '@src/utils/rawToDiscordoo'

export class DefaultGatewayProvider implements GatewayProvider {
  public client: Client
  private manager: WebSocketManager
  private options: WebSocketManagerOptions

  constructor(client: Client, options: WebSocketManagerOptions) {
    this.client = client
    this.options = options

    this.manager = new WebSocketManager(this, options)
  }

  connect(shards?: GatewayShardsInfo): Promise<unknown> {
    return this.manager.connect(shards)
  }

  async disconnect(shards?: number[]): Promise<unknown> {
    return this.manager.disconnect(shards)
  }

  emit(event: string, ...data: any[]): unknown {
    return this.client.internals.gateway.emit(rawToDiscordoo(event), ...data)
  }

  getGateway(): Promise<GatewayBotInfo> {
    return this.client.internals.gateway.getGateway()
  }

  ping(): number
  ping(shards: number[]): number[]
  ping(shards?: number[]): number | number[] {
    switch (Array.isArray(shards)) {
      case true:
        return shards!.map(id => this.manager.shards.get(id)?.ping ?? -1)
      case false:
        return (this.manager.shards.reduce((prev, curr) => prev + curr.ping, 0) / this.manager.shards.size) | 1
    }
  }

  reorganizeShards(shards: GatewayShardsInfo): Promise<unknown> {
    this.manager.destroy()
    return this.manager.connect(shards)
  }

  async reconnect(shards?: number[]): Promise<unknown> {
    switch (Array.isArray(shards)) {
      case true:
        return shards!.forEach(shard => this.manager.shards.get(shard)?.destroy({ reconnect: true }))
      case false:
        return this.manager.shards.forEach(shard => shard.destroy({ reconnect: true }))
    }
  }

  send(data: Record<string, any>, shards?: number[]): unknown {
    switch (Array.isArray(shards)) {
      case true:
        shards!.forEach(id => this.manager.shards.get(id)?.socketSend(data as any)) // TODO: ???
        break
      case false:
        this.manager.shards.forEach(shard => shard.socketSend(data as any)) // TODO: ???
    }

    return void 100500
  }

  waitShardSpawnTurn(shardId: number): Promise<unknown> {
    return this.client.internals.gateway.waitShardSpawnTurn(shardId)
  }

  async init(): Promise<unknown> {
    return void 100500
  }

}
