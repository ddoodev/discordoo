import { WebSocketOPCodes } from '@src/core/Constants'
import { GatewayDispatchEvents } from 'discord-api-types'

export interface WebSocketPacket {
  op: WebSocketOPCodes
  d: any
  s: number | undefined
  t: GatewayDispatchEvents
}
