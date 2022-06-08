import { GatewayBotInfo, GatewayProvider, GatewaySendOptions, GatewayShardsInfo } from '@discordoo/providers'
import { Client } from '@src/core'
import { WebSocketManager } from '@src/gateway/WebSocketManager'
import { rawToDiscordoo } from '@src/utils/rawToDiscordoo'
import { CompletedGatewayOptions } from '@src/gateway/interfaces/GatewayOptions'
import { GatewaySendPayloadLike } from '@discordoo/providers'
import { WebSocketClientEvents } from '@src/constants'

export class DefaultGatewayProvider implements GatewayProvider {
  public client: Client
  private manager: WebSocketManager
  private options: CompletedGatewayOptions

  constructor(client: Client, options: CompletedGatewayOptions) {
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

  emit(shardId: number, event: string, ...data: any[]): unknown {
    // if (event !== 'PRESENCE_UPDATE') console.log('shard', shardId, 'event', event)
    return this.client.internals.gateway.emit(
      shardId,
      event === WebSocketClientEvents.CONNECTED ? 'shardConnected' : rawToDiscordoo(event),
      ...data
    )
  }

  getGateway(): Promise<GatewayBotInfo> {
    return this.client.internals.gateway.getGateway()
  }

  ping(): number
  ping(shards: number[]): Array<[ number, number ]>
  ping(shards?: number[]): number | Array<[ number, number ]> {
    switch (Array.isArray(shards)) {
      case true:
        return shards!.map(id => ([ id, this.manager.shards.get(id)?.ping ?? -1 ]))
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

  send(data: GatewaySendPayloadLike, options: GatewaySendOptions = {}): unknown {
    switch (Array.isArray(options.shards)) {
      case true:
        options.shards!.forEach(id => this.manager.shards.get(id)?.socketSend(data))
        break
      case false:
        this.manager.shards.forEach(shard => shard.socketSend(data))
    }

    return undefined
  }

  waitShardSpawnTurn(shardId: number): Promise<unknown> {
    return this.client.internals.gateway.waitShardSpawnTurn(shardId)
  }

  async init(): Promise<unknown> {
    return undefined
  }

}
