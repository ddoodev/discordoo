import { GatewaySendOptions, GatewaySendPayloadLike } from '@discordoo/providers'

/** Gateway application that contains useful info/methods */
export interface ClientGatewayApplication {

  /** Average delay to Discord gateway, calculated from the delay of all the shards that are in this application. */
  ping: number

  /** If you want to know the gateway delay of shards individually, use this method. */
  latency(shards: number[]): Array<[ number, number ]>

  /** This will disconnect specified/all shards from gateway and then connect them. */
  reconnect(shards?: number[]): Promise<unknown>

  /** Send some packet to the gateway. Use the options to specify which shards to send this packet on. */
  send(data: GatewaySendPayloadLike, options?: GatewaySendOptions): unknown

  events: {
    currently: number
    previousSecond: number
  }

}