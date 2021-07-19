import { WebSocketOpCodes } from '@src/core/Constants'
import { GatewayDispatchEvents } from 'discord-api-types'

export interface WebSocketPacket {
  op: WebSocketOpCodes
  d: any
  s: number | undefined
  t: GatewayDispatchEvents
}
