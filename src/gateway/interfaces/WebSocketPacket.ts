import { WebSocketDispatchEvents } from '@src/constants'
import { GatewayOpCodes } from '@discordoo/providers'

export interface WebSocketPacket {
  op: GatewayOpCodes
  d: any
  s: number | undefined
  t: WebSocketDispatchEvents
}
