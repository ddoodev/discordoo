import { GatewaySendPayloadLike } from '@discordoo/providers'
import { Client } from '@src/core'
import { GatewayAppSendOptions } from '@src/core/client/app/GatewayAppSendOptions'
import { ShardListResolvable } from '@src/utils'
import { CompletedGatewayOptions } from '@src/gateway'

/** Gateway application that contains useful info/methods */
export interface ClientGatewayApplication {
  /** Gateway options used */
  options: CompletedGatewayOptions

  /** Client to which this application is attached */
  client: Client

  /** Average delay to Discord gateway, calculated from the delay of all the shards that are in this application. */
  ping: number

  /** Gateway shard ids that served by this client */
  shards: number[]

  /** If you want to know the gateway delay of shards individually, use this method. */
  latency(shards: ShardListResolvable): Array<[ number, number ]>

  /** This will disconnect specified/all shards from gateway and then connect them. */
  reconnect(shards?: ShardListResolvable): Promise<unknown>

  /** Send some packet to the gateway. Use the options to specify which shards to send this packet on. */
  send(data: GatewaySendPayloadLike, options?: GatewayAppSendOptions): unknown
}